"use client";

import Link from "next/link";

interface EnvelopeCardProps {
  id: string;
  fakeUsername: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function EnvelopeCard({ id, fakeUsername, status }: EnvelopeCardProps) {
  const replied = status === "replied";

  return (
    <Link href={`/unlock/${id}`} className="block group" style={{ marginTop: 12 }}>
      <div className="envelope-card rounded-sm relative" style={{ minHeight: 160 }}>

        {/* Name strip at top (above flap visually) */}
        {/* V-flap */}
        <div className="envelope-flap" />

        {/* Bottom fold lines */}
        <div className="envelope-fold-left" />
        <div className="envelope-fold-right" />

        {/* Centered name + status */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-4"
          style={{ fontFamily: "Playfair Display, serif", color: "#2c1810" }}
        >
          <p className="font-extrabold text-xl leading-snug text-center truncate w-full">{fakeUsername}</p>
          <span className={`status-badge ${replied ? "status-replied" : "status-pending"}`}>
            {replied ? "Reply inside" : "Awaiting"}
          </span>
        </div>
      </div>
    </Link>
  );
}
