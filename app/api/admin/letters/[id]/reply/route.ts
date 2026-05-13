import { NextRequest } from "next/server";
import { getAdminFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/letters/[id]/reply">
) {
  const isAdmin = await getAdminFromCookie();
  if (!isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { reply } = (await request.json()) as { reply: string };

  if (!reply?.trim()) {
    return Response.json({ error: "Reply required" }, { status: 400 });
  }

  const letter = await prisma.letter.findUnique({ where: { id } });
  if (!letter) {
    return Response.json({ error: "Letter not found" }, { status: 404 });
  }

  const updated = await prisma.letter.update({
    where: { id },
    data: { reply: reply.trim().slice(0, 2000), status: "replied" },
    select: { id: true, status: true },
  });

  return Response.json(updated);
}
