import { Post } from "@prisma/client";

export interface ScoredArticle extends Post {
  aiScore: number;
  scoreBreakdown: {
    relevance: number;
    novelty: number;
    engagement: number;
    informationDensity: number;
  };
}

export interface SummarizedArticle extends ScoredArticle {
  aiSummary: string;
  aiTags: string[];
  aiCategory: string;
}

export type FinalArticle = SummarizedArticle;

export interface AgentState {
  runId: string;
  rawArticles: Post[];
  scoredArticles: ScoredArticle[];
  summarizedArticles: SummarizedArticle[];
  selectedArticles: FinalArticle[];
  error: string | null;
}