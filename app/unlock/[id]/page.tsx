"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StoreHeader from "@/components/StoreHeader";

interface LetterData {
  id: string;
  fakeUsername: string;
  message: string;
  reply: string | null;
  status: string;
  createdAt: string;
}

type Stage = "pin" | "opening" | "open";

export default function UnlockPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<LetterData | null>(null);
  const [stage, setStage] = useState<Stage>("pin");

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/letters/${params.id}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not unlock.");
        setLoading(false);
        return;
      }

      setLetter(data);
      setStage("opening");
      // After animation, show letter
      setTimeout(() => setStage("open"), 1400);
    } catch {
      setError("Failed to unlock. Please try again.");
      setLoading(false);
    }
  }

  const date = letter
    ? new Date(letter.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="page-wrapper min-h-screen">
      <StoreHeader />

      <main className="max-w-2xl mx-auto px-4 py-10">
        {stage === "pin" && (
          <>
            <div className="text-center mb-8">
              {/* Static sealed envelope illustration */}
              <div className="relative mx-auto mb-6" style={{ width: 200, height: 130 }}>
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "#e8d5a3",
                    border: "1px solid var(--sepia)",
                    boxShadow: "2px 4px 12px rgba(44,24,16,0.18)",
                  }}
                />
                {/* Flap */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  width: 0, height: 0,
                  borderLeft: "100px solid transparent",
                  borderRight: "100px solid transparent",
                  borderTop: "60px solid #c8a96e",
                }} />
                {/* Fold lines */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0,
                  width: 0, height: 0,
                  borderBottom: "50px solid #d4bf8e",
                  borderRight: "100px solid transparent",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 0, height: 0,
                  borderBottom: "50px solid #c8b07a",
                  borderLeft: "100px solid transparent",
                }} />
                {/* Wax seal */}
                <div
                  className="wax-seal"
                  style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -20%)",
                    zIndex: 3,
                  }}
                >
                  N
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[var(--ink)]">
                Unlock Your Letter
              </h2>
              <div className="divider-ornament">— ✦ —</div>
              <p className="text-sm text-[var(--aged)] font-typewriter">
                Enter the secret PIN you chose when you wrote this letter.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="letter-paper p-8 space-y-6">
              <div>
                <label className="block font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
                  YOUR SECRET PIN
                </label>
                <input
                  className="vintage-input text-center text-xl tracking-widest"
                  type="password"
                  placeholder="• • • • • •"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-[var(--wax)] font-typewriter text-sm border border-[var(--wax)] p-3 text-center">
                  {error}
                </p>
              )}

              <div className="text-center pt-2">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Unsealing..." : "Unseal Letter ✦"}
                </button>
              </div>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-[var(--aged)] font-typewriter underline"
              >
                ← Return to the Dock
              </button>
            </div>
          </>
        )}

        {(stage === "opening" || stage === "open") && letter && (
          <div className="envelope-scene">
            {stage === "opening" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-[var(--ink)]">Opening…</h2>
                </div>

                {/* Envelope opening animation */}
                <div
                  className="relative mx-auto"
                  style={{
                    width: "100%", maxWidth: 400, height: 260,
                    background: "#e8d5a3",
                    border: "1px solid var(--sepia)",
                    boxShadow: "4px 8px 24px rgba(44,24,16,0.2)",
                    overflow: "hidden",
                  }}
                >
                  {/* Fold lines */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0,
                    width: 0, height: 0,
                    borderBottom: "80px solid #d4bf8e",
                    borderRight: "200px solid transparent",
                  }} />
                  <div style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 0, height: 0,
                    borderBottom: "80px solid #c8b07a",
                    borderLeft: "200px solid transparent",
                  }} />

                  {/* Flap — animates open */}
                  <div
                    className="envelope-top-flap open"
                    style={{
                      borderLeft: "200px solid transparent",
                      borderRight: "200px solid transparent",
                      borderTop: "90px solid #c8a96e",
                    }}
                  />

                  {/* Letter peeking out */}
                  <div
                    className="envelope-letter-reveal open old-paper"
                    style={{ fontSize: 12, color: "var(--ink-light)", padding: 12 }}
                  >
                    <p className="font-typewriter text-xs mb-1 tracking-widest text-[var(--aged)]">FROM</p>
                    <p style={{ fontFamily: "Playfair Display, serif", fontWeight: 600 }}>
                      {letter.fakeUsername}
                    </p>
                    <p className="mt-2 italic truncate">{letter.message.slice(0, 60)}…</p>
                  </div>
                </div>
              </>
            )}

            {stage === "open" && (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">✉</div>
                  <h2 className="text-2xl font-bold text-[var(--ink)]">Your Letter</h2>
                  <div className="divider-ornament">— ✦ —</div>
                </div>

                <div className="old-paper p-8" style={{ animation: "fadeSlideUp 0.5s ease" }}>

                  <div className="text-right font-typewriter text-xs text-[var(--aged)] mb-4">
                    {date}
                  </div>

                  <p className="font-typewriter text-xs text-[var(--aged)] tracking-widest mb-1">FROM</p>
                  <p
                    className="text-lg font-semibold text-[var(--ink)] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {letter.fakeUsername}
                  </p>

                  <div className="divider-ornament text-xs">· · ·</div>

                  <div className="mt-4 text-[var(--ink)] whitespace-pre-wrap leading-7">
                    {letter.message}
                  </div>

                  {letter.reply ? (
                    <>
                      <div className="mt-8 pt-6 border-t border-[var(--sepia)]">
                        <p className="font-typewriter text-xs text-[var(--aged)] tracking-widest mb-1">
                          REPLY FROM THE STOREKEEPER
                        </p>
                        <div className="mt-3 text-[var(--ink)] whitespace-pre-wrap leading-7 italic">
                          {letter.reply}
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <span className="status-badge status-replied">Replied</span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-8 pt-6 border-t border-[var(--sepia)] text-center">
                      <span className="status-badge status-pending">Awaiting Reply</span>
                      <p className="text-xs text-[var(--aged)] font-typewriter mt-2">
                        The storekeeper has not yet replied. Check back soon.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => router.push("/")}
                    className="text-sm text-[var(--aged)] font-typewriter underline"
                  >
                    ← Return to the Dock
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
