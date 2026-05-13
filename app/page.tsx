import EnvelopeCard from "@/components/EnvelopeCard";
import StoreHeader from "@/components/StoreHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getLetters() {
  return prisma.letter.findMany({
    where: { expiresAt: { gt: new Date() } },
    select: { id: true, fakeUsername: true, status: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function Home() {
  const letters = await getLetters();

  return (
    <div className="page-wrapper min-h-screen relative z-10">
      <StoreHeader />

      <main className="max-w-5xl mx-auto px-4 py-10 relative z-10">

        {/* Section header */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold"
            style={{ color: "var(--ink)", fontFamily: "Playfair Display, serif" }}
          >
            The Letter Dock
          </h2>
          <div className="divider-ornament">⚜ &nbsp;·&nbsp; ⚜</div>
          <p className="font-typewriter text-xs tracking-widest" style={{ color: "var(--aged)" }}>
            All letters await their recipients — unlock yours with your secret PIN
          </p>
        </div>

        {/* Cork board */}
        <div className="cork-board">
          {letters.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-60">✉</div>
              <p
                className="italic text-lg"
                style={{ color: "#c8a060", fontFamily: "Lora, serif" }}
              >
                The dock is empty. Be the first to write.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-8">
              {letters.map((letter) => (
                <EnvelopeCard
                  key={letter.id}
                  id={letter.id}
                  fakeUsername={letter.fakeUsername}
                  status={letter.status}
                  createdAt={letter.createdAt.toISOString()}
                  expiresAt={letter.expiresAt.toISOString()}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
