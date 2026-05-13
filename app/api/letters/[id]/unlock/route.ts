import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPin } from "@/lib/hash";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/letters/[id]/unlock">
) {
  const { id } = await ctx.params;
  const { pin } = (await request.json()) as { pin: string };

  if (!pin) {
    return Response.json({ error: "PIN required" }, { status: 400 });
  }

  const letter = await prisma.letter.findUnique({ where: { id } });

  if (!letter || letter.expiresAt < new Date()) {
    return Response.json({ error: "Letter not found" }, { status: 404 });
  }

  const valid = await verifyPin(pin, letter.pinHash);
  if (!valid) {
    return Response.json({ error: "Invalid PIN" }, { status: 401 });
  }

  return Response.json({
    id: letter.id,
    fakeUsername: letter.fakeUsername,
    message: letter.message,
    reply: letter.reply,
    status: letter.status,
    createdAt: letter.createdAt,
  });
}
