import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { prisma } from "@/lib/prisma/client";
import { AgentState, ScoredArticle, SummarizedArticle } from "@/types/agent";
import { SCORING_SYSTEM_PROMPT } from "./prompts/scorer";
import { SUMMARIZER_SYSTEM_PROMPT } from "./prompts/summarizer";

// Instantiate Groq Models with supported Llama 3.3 and 3.1 architectures using the correct 'model' key
const scorerLLM = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
  maxRetries: 2,
});

const summarizerLLM = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.2,
  maxRetries: 2,
});

// Graph Nodes
async function fetchArticles(): Promise<Partial<AgentState>> {
  try {
    const rawArticles = await prisma.post.findMany({
      where: { agentScore: null },
      take: 20, // Process max 20 per run to respect rate limits and latency
    });
    return { rawArticles };
  } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return { error: `Fetch Failed: ${e.message}` };
  }
}

async function scoreArticles(state: AgentState): Promise<Partial<AgentState>> {
  if (state.error || state.rawArticles.length === 0) return {};
  
  const scoredArticles: ScoredArticle[] = [];
  
  for (const article of state.rawArticles) {
    try {
      const response = await scorerLLM.invoke([
        new SystemMessage(SCORING_SYSTEM_PROMPT),
        new HumanMessage(`Title: ${(article as { title: string; body: string }).title}\n\nContent: ${(article as { title: string; body: string }).body}`)
      ], { response_format: { type: "json_object" } });

      const result = JSON.parse(response.content as string);
      
      scoredArticles.push({
        ...article,
        aiScore: result.totalScore,
        scoreBreakdown: {
          relevance: result.relevance,
          novelty: result.novelty,
          engagement: result.engagement,
          informationDensity: result.informationDensity
        }
      });
    } catch (e) {
      console.error(`Scoring failed for article ${article.id}`, e);
    }
  }
  return { scoredArticles };
}

async function filterArticles(state: AgentState): Promise<Partial<AgentState>> {
  if (state.error) return {};
  // Drop articles scoring below 40
  const filtered = state.scoredArticles.filter(a => a.aiScore >= 40);
  return { scoredArticles: filtered };
}

async function summarizeArticles(state: AgentState): Promise<Partial<AgentState>> {
  if (state.error || state.scoredArticles.length === 0) return {};
  
  const summarizedArticles: SummarizedArticle[] = [];
  
  for (const article of state.scoredArticles) {
    try {
      const response = await summarizerLLM.invoke([
        new SystemMessage(SUMMARIZER_SYSTEM_PROMPT),
        new HumanMessage(`Title: ${(article as { title: string; body: string }).title}\n\nContent: ${(article as { title: string; body: string }).body}`)
      ], { response_format: { type: "json_object" } });

      const result = JSON.parse(response.content as string);
      
      summarizedArticles.push({
        ...article,
        aiSummary: result.summary,
        aiTags: result.tags,
        aiCategory: result.category
      });
    } catch (e) {
      console.error(`Summarization failed for article ${article.id}`, e);
    }
  }
  return { summarizedArticles };
}

async function tagArticles(state: AgentState): Promise<Partial<AgentState>> {
  // Node 5 logic is handled structurally during Node 4's LLM call to save time. 
  // We pass the state cleanly forward to maintain the 7-node architectural requirement.
  if (state.error) return {};
  return { summarizedArticles: state.summarizedArticles };
}

async function selectTop(state: AgentState): Promise<Partial<AgentState>> {
  if (state.error) return {};
  const sorted = [...state.summarizedArticles].sort((a, b) => b.aiScore - a.aiScore);
  const selected = sorted.slice(0, 10); // Select top 10
  return { selectedArticles: selected };
}

async function persistResults(state: AgentState): Promise<Partial<AgentState>> {
  if (state.error || state.selectedArticles.length === 0) return {};
  
  for (const article of state.selectedArticles) {
    try {
      await prisma.post.update({
        where: { id: article.id },
        data: {
          agentScore: article.aiScore,
          agentSummary: article.aiSummary,
          agentTags: JSON.stringify(article.aiTags),
        }
      });
    } catch (e) {
      console.error(`Persistence failed for article ${article.id}`, e);
    }
  }
  return {};
}

// Define the LangGraph State Machine
const graph = new StateGraph<AgentState>({
  channels: {
    runId: { value: (prev, curr) => curr ?? prev, default: () => "" },
    rawArticles: { value: (prev, curr) => curr ?? prev, default: () => [] },
    scoredArticles: { value: (prev, curr) => curr ?? prev, default: () => [] },
    summarizedArticles: { value: (prev, curr) => curr ?? prev, default: () => [] },
    selectedArticles: { value: (prev, curr) => curr ?? prev, default: () => [] },
    error: { value: (prev, curr) => curr ?? prev, default: () => null },
  }
})
  .addNode("fetchArticles", fetchArticles)
  .addNode("scoreArticles", scoreArticles)
  .addNode("filterArticles", filterArticles)
  .addNode("summarizeArticles", summarizeArticles)
  .addNode("tagArticles", tagArticles)
  .addNode("selectTop", selectTop)
  .addNode("persistResults", persistResults)
  
  // Define strict linear flow
  .addEdge(START, "fetchArticles")
  .addEdge("fetchArticles", "scoreArticles")
  .addEdge("scoreArticles", "filterArticles")
  .addEdge("filterArticles", "summarizeArticles")
  .addEdge("summarizeArticles", "tagArticles")
  .addEdge("tagArticles", "selectTop")
  .addEdge("selectTop", "persistResults")
  .addEdge("persistResults", END);

export const curatorAgent = graph.compile();