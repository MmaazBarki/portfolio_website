import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

// ── RESUME FILE ──────────────────────────────────────────────────────────────
// The resume PDF is stored at src/imports/Resume.pdf
// To update it: replace the file at src/imports/Resume.pdf
// To change the download filename: edit the `download` attribute below
// @ts-expect-error — Vite handles ?url imports for static assets
import resumePdf from "../../imports/Resume.pdf?url";
// ─────────────────────────────────────────────────────────────────────────────

const BOOT_SEQUENCE = [
  { text: "> SYSTEM BOOT...............................................", suffix: "[ OK ]", suffixColor: "#00ff9f" },
  { text: "> LOADING OPERATIVE PROFILE: MAAZ_BARKI.......................", suffix: "[ OK ]", suffixColor: "#00ff9f" },
  { text: "> CLEARANCE LEVEL: DEAN'S HONOR LIST · OCT 2023............", suffix: "[ OK ]", suffixColor: "#00ff9f" },
  { text: "> WARNING: UNAUTHORIZED ACCESS DETECTED", suffix: "", suffixColor: "#ff2d78", color: "#ff2d78" },
  { text: "> ESTABLISHING SECURE CONNECTION...........................", suffix: "[ OK ]", suffixColor: "#00ff9f" },
  { text: "> WELCOME, OPERATIVE.", suffix: "", suffixColor: "", color: "#00e5ff" },
];

/* ── Canvas perspective grid ── */
function CyberpunkGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
    };
    window.addEventListener("mousemove", handleMouse);

    const startTime = performance.now();
    const draw = (now: number) => {
      const elapsed = now - startTime;
      const { width, height } = canvas;
      const mx = mouseRef.current.x;
      ctx.clearRect(0, 0, width, height);
      const vx = width * (0.44 + mx * 0.12);
      const vy = height * 0.38;
      const numV = 24, numH = 16;
      const scrollOffset = (elapsed * 0.00018) % (1 / numH);

      for (let i = 0; i <= numV; i++) {
        const xBottom = (i / numV) * width;
        const t = Math.abs((i / numV) - 0.5) * 2;
        ctx.strokeStyle = `rgba(0,229,255,${0.04 + t * 0.07})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(xBottom, height); ctx.stroke();
      }
      for (let i = 0; i < numH; i++) {
        const raw = ((i / numH) + scrollOffset) % 1;
        if (raw < 0.015) continue;
        const t = Math.pow(raw, 1.4);
        const y = vy + (height - vy) * t;
        const leftX = vx - vx * raw * 0.98;
        const rightX = vx + (width - vx) * raw * 0.98;
        ctx.strokeStyle = `rgba(0,229,255,${raw * 0.22})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(leftX, y); ctx.lineTo(rightX, y); ctx.stroke();
      }
      const grad = ctx.createLinearGradient(0, vy - 1, 0, vy + 1);
      grad.addColorStop(0, "rgba(0,229,255,0)");
      grad.addColorStop(0.5, "rgba(0,229,255,0.18)");
      grad.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, vy - 1, width, 2);
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", handleMouse); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.9 }} />;
}

/* ── Boot sequence ── */
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<Array<{ text: string; suffix: string; suffixColor: string; color?: string; done: boolean }>>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= BOOT_SEQUENCE.length) { const t = setTimeout(onComplete, 500); return () => clearTimeout(t); }
    const line = BOOT_SEQUENCE[currentLine];
    const fullText = line.text;
    if (currentChar < fullText.length) {
      const t = setTimeout(() => {
        setLines(prev => { const next = [...prev]; next[currentLine] = { text: fullText.slice(0, currentChar + 1), suffix: "", suffixColor: line.suffixColor, color: line.color, done: false }; return next; });
        setCurrentChar(c => c + 1);
      }, 14 + Math.random() * 10);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines(prev => { const next = [...prev]; next[currentLine] = { text: fullText, suffix: line.suffix, suffixColor: line.suffixColor, color: line.color, done: true }; return next; });
        setCurrentLine(l => l + 1); setCurrentChar(0);
      }, 90);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar, onComplete]);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(0.58rem, 1.2vw, 0.78rem)", lineHeight: 2.1, textAlign: "left", maxWidth: 560 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ color: line.color || "#c8c8e0" }}>{line.text}</span>
          {line.done && line.suffix && <span style={{ color: line.suffixColor, textShadow: `0 0 8px ${line.suffixColor}` }}>{line.suffix}</span>}
          {!line.done && i === currentLine && <span style={{ color: "#00e5ff", animation: "blink 0.8s step-end infinite" }}>█</span>}
        </div>
      ))}
      {currentLine < BOOT_SEQUENCE.length && lines.length === currentLine && <div><span style={{ color: "#00e5ff", animation: "blink 0.8s step-end infinite" }}>█</span></div>}
    </div>
  );
}

/* ── Hero content ── */
function HeroContent() {
  const navigate = useNavigate();

  return (
    <div className="terminal-fadein" style={{ width: "100%", textAlign: "center" }}>
      {/* Status badge */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff9f", display: "inline-block", boxShadow: "0 0 8px #00ff9f, 0 0 16px #00ff9f40" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#00ff9f", letterSpacing: "0.1em" }}>
          SYSTEM ONLINE · OPERATIVE AUTHENTICATED
        </span>
      </div>

      {/* Name — responsive, wraps gracefully on small screens */}
      <h1
        className="glitch-hover"
        data-text="MUHAMMAD MAAZ BARKI"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          /* ── HEADING SIZE: adjust clamp max (4rem) to resize the name ── */
          fontSize: "clamp(1.6rem, 5.2vw, 4rem)",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "0.06em",
          lineHeight: 1.15,
          marginBottom: "1rem",
          textShadow: "2px 0 0 #ff2d78, -2px 0 0 #00e5ff, 0 0 40px rgba(255,255,255,0.06)",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        MUHAMMAD MAAZ BARKI
      </h1>

      {/* Subtitle */}
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)", color: "#00e5ff", letterSpacing: "0.18em", marginBottom: "1.75rem", textShadow: "0 0 8px #00e5ff, 0 0 24px #00e5ff44" }}>
        COMPUTER SCIENTIST &nbsp;·&nbsp; AI ENGINEER &nbsp;·&nbsp; CS EDUCATOR
      </div>

      {/* Divider */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
        <div style={{ width: 260, height: 1, background: "linear-gradient(90deg, transparent, #ff2d78, #00e5ff, transparent)" }} />
      </div>

      {/* Bio */}
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(0.75rem, 1.3vw, 0.86rem)", color: "#c8c8e0", lineHeight: 1.95, marginBottom: "2.25rem", maxWidth: 580, margin: "0 auto 2.25rem" }}>
        Builder of multi-agent AI systems. Backgrounds rooted in the humanities — approaches engineering
        with equal weight on the <span style={{ color: "#ff2d78" }}>why</span> and the human impact as
        on the <span style={{ color: "#00e5ff" }}>how</span>. Led instruction for 300+ students, shipped
        production-grade AI pipelines, and navigated government–academia–industry intersections at the
        national level.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {[
          { label: "[ RUN PROJECTS.exe ]", color: "#ff2d78", path: "/projects" },
          { label: "[ CONTACT_ME.exe ]",       color: "#00e5ff", path: "/contact"  },
        ].map(btn => (
          <button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            style={{ background: "transparent", border: `1px solid ${btn.color}`, color: btn.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", padding: "0.65rem 1.3rem", cursor: "pointer", letterSpacing: "0.04em", boxShadow: `0 0 12px ${btn.color}40`, transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${btn.color}18`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            {btn.label}
          </button>
        ))}

        {/* ── RESUME DOWNLOAD ─────────────────────────────────────────────────
            File: src/imports/Resume.pdf
            To update: replace src/imports/Resume.pdf with your new resume
            The download filename is set in the `download` attribute below
        ────────────────────────────────────────────────────────────────────── */}
        <a
          href={resumePdf}
          download="Muhammad_Maaz_Barki_Resume.pdf"
          style={{ background: "transparent", border: "1px solid rgba(0,255,159,0.5)", color: "#00ff9f", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", padding: "0.65rem 1.3rem", cursor: "pointer", letterSpacing: "0.04em", boxShadow: "0 0 12px rgba(0,255,159,0.25)", transition: "all 0.2s", textDecoration: "none", display: "inline-block" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,255,159,0.1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
        >
          [ DOWNLOAD_RESUME.pdf ]
        </a>
      </div>

      {/* Social links */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        {[
          { label: "[ LINKEDIN ]", href: "https://www.linkedin.com/in/muhammad-maaz-barki/" },
          { label: "[ EMAIL ]",    href: "mailto:maazbarki@gmail.com" },
        ].map(link => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#4a4a6a", textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s, text-shadow 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#00e5ff"; (e.currentTarget as HTMLAnchorElement).style.textShadow = "0 0 8px #00e5ff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a4a6a"; (e.currentTarget as HTMLAnchorElement).style.textShadow = "none"; }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

const BOOT_SESSION_KEY = "heroBootDone";

export function HeroSection() {
  // Read from sessionStorage on mount so SPA navigation back to "/" skips the
  // boot animation. sessionStorage is cleared automatically on a true page
  // reload or when the browser tab is closed, so the animation still plays
  // on a fresh visit or hard refresh.
  const [bootDone, setBootDone] = useState<boolean>(
    () => sessionStorage.getItem(BOOT_SESSION_KEY) === "true"
  );

  const handleBootComplete = () => {
    sessionStorage.setItem(BOOT_SESSION_KEY, "true");
    setBootDone(true);
  };

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 2rem 3rem", overflow: "hidden", background: "linear-gradient(180deg, #000000 0%, #03030f 60%, #000000 100%)" }}>
      <CyberpunkGrid />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,229,255,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "center" }}>
        {!bootDone ? <BootSequence onComplete={handleBootComplete} /> : <HeroContent />}
      </div>
      {bootDone && (
        <div className="terminal-fadein" style={{ position: "absolute", bottom: "3.5rem", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4a6a", letterSpacing: "0.15em", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
          <span>USE NAVIGATION TO EXPLORE</span>
          <span style={{ animation: "blink 1.5s step-end infinite", color: "#00e5ff" }}>▼</span>
        </div>
      )}
    </section>
  );
}
