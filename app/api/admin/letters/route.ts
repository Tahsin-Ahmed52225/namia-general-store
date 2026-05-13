import { getAdminFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const isAdmin = await getAdminFromCookie();
  if (!isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const letters = await prisma.letter.findMany({
    select: {
      id: true,
      fakeUsername: true,
      message: true,
      reply: true,
      status: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(letters);
}
