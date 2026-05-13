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
      <div className="envelope-card rounded-sm" style={{ minHeight: 160 }}>

        {/* Name strip at top (above flap visually) */}
        <div
          className="relative z-10 pt-3 px-4 text-center"
          style={{ fontFamily: "Playfair Display, serif", color: "#2c1810" }}
        >
          <p className="font-semibold text-sm leading-snug truncate">{fakeUsername}</p>
        </div>

        {/* V-flap */}
        <div className="envelope-flap" />

        {/* Bottom fold lines */}
        <div className="envelope-fold-left" />
        <div className="envelope-fold-right" />

        {/* Status */}
        <div className="relative z-10 text-center mt-2 pb-10">
          <span className={`status-badge ${replied ? "status-replied" : "status-pending"}`}>
            {replied ? "Reply inside" : "Awaiting"}
          </span>
        </div>
      </div>
    </Link>
  );
}
