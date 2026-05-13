import { getAdminFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/letters/[id]">
) {
  const isAdmin = await getAdminFromCookie();
  if (!isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const letter = await prisma.letter.findUnique({ where: { id } });
  if (!letter) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.letter.delete({ where: { id } });
  return Response.json({ ok: true });
}
