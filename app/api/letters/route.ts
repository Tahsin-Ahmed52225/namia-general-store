import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPin } from "@/lib/hash";

export async function GET() {
  const letters = await prisma.letter.findMany({
    where: { expiresAt: { gt: new Date() } },
    select: {
      id: true,
      fakeUsername: true,
      status: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(letters);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fakeUsername, pin, message } = body as {
    fakeUsername: string;
    pin: string;
    message: string;
  };

  if (!fakeUsername?.trim() || !pin?.trim() || !message?.trim()) {
    return Response.json({ error: "All fields required" }, { status: 400 });
  }
  if (pin.length < 4 || pin.length > 12) {
    return Response.json(
      { error: "PIN must be 4–12 characters" },
      { status: 400 }
    );
  }

  const pinHash = await hashPin(pin);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const letter = await prisma.letter.create({
    data: {
      fakeUsername: fakeUsername.trim().slice(0, 50),
      pinHash,
      message: message.trim().slice(0, 2000),
      expiresAt,
    },
    select: { id: true, fakeUsername: true, status: true, createdAt: true },
  });

  // Telegram notification — fire and forget
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const text = `📬 New letter in the dock\n\nFrom: ${fakeUsername.trim()}\n\n${message.trim().slice(0, 300)}${message.trim().length > 300 ? "…" : ""}`;
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChat, text }),
    }).catch(() => {}); // never block the response
  }

  return Response.json(letter, { status: 201 });
}
