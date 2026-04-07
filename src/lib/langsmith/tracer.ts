import { Client } from "langsmith";

// Initialize the LangSmith client to push traces to your configured project
export const langsmithClient = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
});

export function createRunMetadata(runType: string) {
  return {
    name: runType,
    project_name: process.env.LANGCHAIN_PROJECT || "agentic-pulse-dev",
    tags: ["agentic-pulse", "curator-agent", runType],
    metadata: {
      timestamp: new Date().toISOString(),
      version: "1.0",
    }
  };
}