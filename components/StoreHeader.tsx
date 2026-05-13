import Link from "next/link";

export default function StoreHeader() {
  return (
    <header className="store-sign py-6 px-4">
      <div className="sign-inner max-w-3xl mx-auto text-center flex flex-col items-center">
        <p className="font-typewriter text-xs tracking-widest mb-2" style={{ color: "#c8a050" }}>
          ✦ &nbsp; ESTABLISHED IN AN AGE LONG FORGOTTEN &nbsp; ✦
        </p>

        {/* Main sign title */}
        <div className="relative inline-block">
          <h1
            className="font-fraktur leading-tight"
            style={{
              fontSize: "clamp(2rem, 6vw, 3.6rem)",
              color: "#f0d080",
              textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 0 30px rgba(200,160,80,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            The Miracle of Namia
          </h1>
        </div>

        <p
          className="tracking-[0.4em] uppercase mt-1 text-sm"
          style={{ color: "#d4a860", fontFamily: "Playfair Display, serif" }}
        >
          General Store
        </p>

        {/* Ornament row */}
        <div className="flex items-center justify-center gap-3 my-3">
          <span style={{ color: "#8a6020", fontSize: 12 }}>━━━━━━</span>
          <span style={{ color: "#c8a050", fontSize: 16 }}>⚜</span>
          <span style={{ color: "#8a6020", fontSize: 12 }}>━━━━━━</span>
        </div>

        <p className="font-typewriter text-xs tracking-wider" style={{ color: "#9a7840" }}>
          Anonymous Letters · Honest Counsel · Perfect Secrecy
        </p>

        {/* Navigation */}
        <nav className="mt-5 flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="btn-secondary text-sm"
            style={{ borderColor: "#8a6020", color: "#f0d080" }}
          >
            The Dock
          </Link>
          <Link
            href="/write"
            className="btn-primary text-sm"
            style={{ background: "#8a3010", borderColor: "#6a2008", boxShadow: "2px 2px 0 #3a0f04" }}
          >
            Write a Letter
          </Link>
        </nav>
      </div>
    </header>
  );
}
