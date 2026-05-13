"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Letter {
  id: string;
  fakeUsername: string;
  message: string;
  reply: string | null;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function fetchLetters() {
    const res = await fetch("/api/admin/letters");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setLetters(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLetters();
  }, []);

  async function handleReply(id: string) {
    const reply = replyText[id]?.trim();
    if (!reply) return;

    setSending(id);
    try {
      const res = await fetch(`/api/admin/letters/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });

      if (res.ok) {
        await fetchLetters();
        setReplyText((prev) => ({ ...prev, [id]: "" }));
        setExpandedId(null);
      }
    } finally {
      setSending(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this letter permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/letters/${id}`, { method: "DELETE" });
      await fetchLetters();
      if (expandedId === id) setExpandedId(null);
    } finally {
      setDeleting(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-[var(--sepia)] py-5 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--ink)]">
            Storekeeper Ledger
          </h1>
          <p className="font-typewriter text-xs text-[var(--aged)]">
            The Miracle of Namia General Store
          </p>
        </div>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          Sign Out
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-typewriter text-xs text-[var(--aged)] tracking-widest">
              LETTERS IN THE DOCK
            </p>
            <p className="text-2xl font-bold text-[var(--ink)]">
              {loading ? "…" : letters.length} letter{letters.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-typewriter text-xs text-[var(--aged)]">
              {letters.filter((l) => l.status === "pending").length} awaiting reply
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-[var(--aged)] font-typewriter">
            Reading the ledger…
          </p>
        ) : letters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--aged)] italic">No letters in the dock.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {letters.map((letter) => (
              <div key={letter.id} className="envelope-card p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p
                        className="font-semibold text-[var(--ink)]"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {letter.fakeUsername}
                      </p>
                      <span
                        className={`status-badge ${letter.status === "replied" ? "status-replied" : "status-pending"}`}
                      >
                        {letter.status === "replied" ? "Replied" : "Awaiting"}
                      </span>
                    </div>
                    <p className="font-typewriter text-xs text-[var(--aged)] mt-1">
                      {date(letter.createdAt)} · expires {date(letter.expiresAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === letter.id ? null : letter.id)
                      }
                      className="btn-secondary text-xs"
                    >
                      {expandedId === letter.id ? "Collapse" : "Read Letter"}
                    </button>
                    <button
                      onClick={() => handleDelete(letter.id)}
                      disabled={deleting === letter.id}
                      className="text-xs font-typewriter px-3 py-1 border border-[var(--wax)] text-[var(--wax)] hover:bg-[var(--wax)] hover:text-[var(--parchment)] transition-colors"
                    >
                      {deleting === letter.id ? "…" : "Delete"}
                    </button>
                  </div>
                </div>

                {expandedId === letter.id && (
                  <div className="mt-4 pt-4 border-t border-[var(--sepia)]">
                    <div className="letter-paper p-5 whitespace-pre-wrap text-[var(--ink)] leading-7 mb-4">
                      {letter.message}
                    </div>

                    {letter.reply && (
                      <div className="mb-4">
                        <p className="font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
                          YOUR PREVIOUS REPLY
                        </p>
                        <div className="letter-paper p-4 italic text-[var(--ink-light)] whitespace-pre-wrap leading-7">
                          {letter.reply}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
                        {letter.reply ? "SEND NEW REPLY" : "YOUR REPLY"}
                      </label>
                      <textarea
                        className="vintage-input"
                        rows={5}
                        placeholder="Write your counsel here..."
                        maxLength={2000}
                        value={replyText[letter.id] || ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [letter.id]: e.target.value,
                          }))
                        }
                        style={{ resize: "vertical" }}
                      />
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleReply(letter.id)}
                          disabled={sending === letter.id || !replyText[letter.id]?.trim()}
                          className="btn-primary text-sm"
                        >
                          {sending === letter.id ? "Sealing…" : "Send Reply ✦"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
