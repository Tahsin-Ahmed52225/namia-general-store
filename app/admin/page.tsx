"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <p className="font-typewriter text-xs tracking-widest text-[var(--aged)] mb-2">
          ✦ RESTRICTED ACCESS ✦
        </p>
        <h1 className="text-3xl font-bold text-[var(--ink)]">
          Storekeeper Entrance
        </h1>
        <div className="divider-ornament">— ✦ —</div>
        <p className="text-sm text-[var(--aged)] font-typewriter">
          The Miracle of Namia General Store
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="letter-paper p-8 space-y-5 w-full max-w-sm"
      >
        <div>
          <label className="block font-typewriter text-xs text-[var(--aged)] tracking-widest mb-2">
            STOREKEEPER PASSWORD
          </label>
          <input
            className="vintage-input text-center tracking-widest"
            type="password"
            placeholder="• • • • • •"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>

        {error && (
          <p className="text-[var(--wax)] font-typewriter text-sm border border-[var(--wax)] p-3 text-center">
            {error}
          </p>
        )}

        <div className="text-center">
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Entering..." : "Enter ✦"}
          </button>
        </div>
      </form>

      <a
        href="/"
        className="mt-6 text-xs text-[var(--aged)] font-typewriter underline"
      >
        ← Back to the Dock
      </a>
    </div>
  );
}
