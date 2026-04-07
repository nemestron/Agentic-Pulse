import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/lib/auth/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "PENDING";
  
  const items = await prisma.publishQueue.findMany({
    where: { status },
    include: { post: true },
    orderBy: { createdAt: "desc" }
  });
  
  return NextResponse.json({ items });
}