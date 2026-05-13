"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StoreHeader from "@/components/StoreHeader";

export default function WritePage() {
  const router = useRouter();
  const [fakeUsername, setFakeUsername] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [letterId, setLetterId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fakeUsername, pin, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setLetterId(data.id);
      setSent(true);
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="page-wrapper min-h-screen">
        <StoreHeader />
        <main className="max-w-2xl mx-auto px-4 py-12 text-center relative z-10">
          <div className="text-6xl mb-4">✉</div>
          <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">
            Your letter has been sealed
          </h2>
          <div className="divider-ornament">— ✦ —</div>
          <p className="text-[var(--ink-light)] mt-4 mb-2">
            It now rests in the dock. When the storekeeper replies,
            return to the dock and unlock it with your PIN.
          </p>
          <div className="letter-paper p-6 mt-6 text-left">
            <p className="font-typewriter text-xs text-[var(--aged)] mb-2 tracking-widest">
              KEEP THIS SAFE
            </p>
            <p className="text-[var(--ink)]">
              <strong>Letter ID:</strong>{" "}
              <span className="font-typewriter text-sm">{letterId}</span>
            </p>
            <p className="mt-2 text-sm text-[var(--ink-light)] italic">
              (Your PIN is known only to you — store it securely.)
            </p>
          </div>
          <div className="flex gap-4 justify-center mt-8">
            <button
              className="btn-secondary"
              onClick={() => router.push("/")}
            >
              View The Dock
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setSent(false);
                setFakeUsername("");
                setPin("");
                setMessage("");
                setLetterId("");
              }}
            >
              Write Another
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper min-h-screen">
      <StoreHeader />
      <main className="max-w-2xl mx-auto px-4 py-10 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--ink)]">
            Compose Your Letter
          </h2>
          <div className="divider-ornament">— ✦ —</div>
          <p className="text-sm text-[var(--aged)] font-typewriter">
            Choose a name only you know, set a secret PIN, then write your heart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="letter-paper p-8 space-y-6">
          <div>
            <label className="block font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
              YOUR ALIAS (fake name for the dock)
            </label>
            <input
              className="vintage-input"
              type="text"
              placeholder="e.g. A Wandering Soul"
              maxLength={50}
              value={fakeUsername}
              onChange={(e) => setFakeUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
              SECRET PIN (4–12 characters — remember this to read your reply)
            </label>
            <input
              className="vintage-input"
              type="password"
              placeholder="Your secret PIN"
              minLength={4}
              maxLength={12}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
              YOUR LETTER
            </label>
            <textarea
              className="vintage-input"
              placeholder="Dear storekeeper, I write to you in confidence..."
              rows={10}
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ resize: "vertical", lineHeight: "28px" }}
            />
            <p className="text-right font-typewriter text-xs text-[var(--aged)] mt-1">
              {message.length}/2000
            </p>
          </div>

          {error && (
            <p className="text-[var(--wax)] font-typewriter text-sm border border-[var(--wax)] p-3">
              {error}
            </p>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Sealing..." : "Seal & Send Letter ✦"}
            </button>
          </div>

          <p className="text-center text-xs font-typewriter text-[var(--aged)] italic">
            Your letter expires in 24 hours. No identity is stored.
          </p>
        </form>
      </main>
    </div>
  );
}
