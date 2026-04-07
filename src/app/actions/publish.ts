"use server";

import { prisma } from "@/lib/prisma/client";
import { sendCuratedArticle } from "@/lib/telegram/client";
import { revalidatePath } from "next/cache";

export async function approvePost(queueId: string, editedTitle?: string, editedBody?: string) {
  await prisma.publishQueue.update({
    where: { id: queueId },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
      editedTitle,
      editedBody
    }
  });
  revalidatePath("/publish");
}

export async function rejectPost(queueId: string, notes?: string) {
  await prisma.publishQueue.update({
    where: { id: queueId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      notes
    }
  });
  revalidatePath("/publish");
}

export async function publishToTelegram(queueId: string) {
  const queueItem = await prisma.publishQueue.findUnique({
    where: { id: queueId },
    include: { post: true }
  });

  if (!queueItem || queueItem.status !== "APPROVED") throw new Error("Invalid state: Only APPROVED items can be published.");

  const title = queueItem.editedTitle || queueItem.post.title;
  const summary = queueItem.editedBody || queueItem.post.agentSummary || "";
  const tags = queueItem.post.agentTags ? JSON.parse(queueItem.post.agentTags) : [];
  const publicUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/p/${queueItem.id}`;

  const result = await sendCuratedArticle({
    title,
    summary,
    tags,
    sourceDomain: queueItem.post.sourceDomain,
    publicUrl,
    originalUrl: queueItem.post.sourceUrl
  });

  await prisma.publishQueue.update({
    where: { id: queueId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
      telegramMessageId: result.result?.message_id?.toString() || "unknown"
    }
  });

  revalidatePath("/publish");
}