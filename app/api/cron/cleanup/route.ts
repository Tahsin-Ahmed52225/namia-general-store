import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.letter.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  return Response.json({ deleted: result.count });
}
