import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/client";
import { curatorAgent } from "@/lib/agents/curator";
import { createRunMetadata } from "@/lib/langsmith/tracer";
import { AgentState } from "@/types/agent";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startTime = Date.now();
    
    // Create initial AgentRun record
    const runRecord = await prisma.agentRun.create({
      data: {
        type: "CURATOR",
        status: "RUNNING",
        input: "Triggered via API",
      }
    });

    const langsmithMetadata = createRunMetadata(`Run_${runRecord.id}`);

    // Execute the LangGraph State Machine
    const rawState = await curatorAgent.invoke(
      { runId: runRecord.id },
      { tags: langsmithMetadata.tags, metadata: langsmithMetadata.metadata }
    );
    
    // Safely cast the dynamically inferred LangGraph state back to our strict interface
    const finalState = rawState as unknown as AgentState;

    const durationMs = Date.now() - startTime;

    if (finalState.error) {
      await prisma.agentRun.update({
        where: { id: runRecord.id },
        data: { status: "FAILED", output: finalState.error, durationMs }
      });
      return NextResponse.json({ error: finalState.error }, { status: 500 });
    }

    // Update AgentRun record on success
    const successOutput = `Processed ${finalState.rawArticles.length}. Scored ${finalState.scoredArticles.length}. Selected Top ${finalState.selectedArticles.length}.`;
    
    await prisma.agentRun.update({
      where: { id: runRecord.id },
      data: { status: "SUCCESS", output: successOutput, durationMs }
    });

    return NextResponse.json({
      success: true,
      runId: runRecord.id,
      durationMs,
      processed: finalState.rawArticles.length,
      selected: finalState.selectedArticles.length
    }, { status: 200 });

  } catch (error: any) {
    console.error("Agent Orchestrator Failure:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}