import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

/* ── Floating binary/hex particle background ── */
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const LABELS = ["0xFF", "0xAB", "01101", "10011", "0x3F", "0b101", "0xDE", "0x4C", "11001", "0xAD", "0x7E", "01010"];
    const NUM = 30;
    const particles = Array.from({ length: NUM }, (_, i) => ({
      label: LABELS[i % LABELS.length],
      x: Math.random(),
      y: Math.random(),
      vy: 0.000012 + Math.random() * 0.000018,
      alpha: 0.03 + Math.random() * 0.06,
      size: 9 + Math.random() * 5,
    }));

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      ctx.font = `${11}px 'JetBrains Mono', monospace`;

      particles.forEach((p) => {
        const y = ((p.y + p.vy * elapsed) % 1.05 + 0.05) % 1.05;
        const yPx = y * height;
        const xPx = p.x * width;
        const pulse = (Math.sin(elapsed * 0.001 + p.x * 10) + 1) * 0.5;
        const alpha = p.alpha * (0.6 + pulse * 0.4);

        ctx.fillStyle = p.x > 0.5 ? `rgba(0,229,255,${alpha})` : `rgba(0,255,159,${alpha})`;
        ctx.fillText(p.label, xPx, yPx);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

/* ── Section heading ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
        ████ CLASSIFIED FILE ████
      </div>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, color: "#ffffff", textShadow: "0 0 20px rgba(255,45,120,0.3)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ color: "#ff2d78", textShadow: "0 0 8px #ff2d78" }}>&gt;</span>
        {children}
      </h2>
      <div style={{ height: 1, background: "linear-gradient(90deg, #ff2d78, #00e5ff, transparent)", marginTop: "1rem", maxWidth: 400 }} />
    </div>
  );
}

const FIELDS = [
  { label: "SUBJECT",          value: "BARKI, MUHAMMAD MAAZ" },
  { label: "CLASSIFICATION",   value: "Computer Science · LUMS Class of '26" },
  { label: "CLEARANCE_LEVEL",  value: "DEAN'S HONOR LIST — OCT 2023", color: "#00ff9f" },
  { label: "AFFILIATION",      value: "LUMS · BSc Computer Science · 2022–2026" },
  { label: "STATUS",           value: "ACTIVE OPERATIVE", color: "#ff2d78" },
  { label: "LOCATION",         value: "Lahore / Multan, Pakistan" },
];

export function OperativeProfile() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="profile"
      ref={ref}
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        background: "rgba(0,4,8,0.97)",
        overflow: "hidden",
        borderTop: "1px solid rgba(0,229,255,0.04)",
      }}
    >
      <ParticleBackground />

      <div
        className={`section-reveal${visible ? " visible" : ""}`}
        style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}
      >
        <SectionLabel>ABOUT_ME.exe</SectionLabel>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "start" }}>
          {/* Left: data readout */}
          <div style={{ border: "1px solid rgba(0,229,255,0.2)", padding: "1.5rem", background: "rgba(0,229,255,0.03)", boxShadow: "0 0 20px rgba(0,229,255,0.05)", fontFamily: "'JetBrains Mono', monospace", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "0.65rem", color: "#4a4a6a", letterSpacing: "0.15em", marginBottom: "1.25rem" }}>
              ╔══ BIOMETRIC DOSSIER ══════════════════╗
            </div>
            {FIELDS.map((f) => (
              <div key={f.label} style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.68rem", color: "#4a4a6a", minWidth: 140, letterSpacing: "0.05em" }}>{f.label}:</span>
                <span style={{ fontSize: "0.78rem", color: f.color || "#c8c8e0", textShadow: f.color ? `0 0 8px ${f.color}44` : "none", flex: 1 }}>
                  {f.value}
                </span>
              </div>
            ))}
            <div style={{ fontSize: "0.65rem", color: "#4a4a6a", letterSpacing: "0.15em", marginTop: "1.25rem" }}>
              ╚══════════════════════════════════════╝
            </div>
          </div>

          {/* Right: prose bio */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#ff2d78", letterSpacing: "0.1em", marginBottom: "1rem", textShadow: "0 0 8px #ff2d78" }}>
              &gt; THREAT_ASSESSMENT.log
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.83rem", color: "#c8c8e0", lineHeight: 2, borderLeft: "2px solid rgba(255,45,120,0.3)", paddingLeft: "1.25rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                SUBJECT_TYPE: Builder of multi-agent AI systems with a rare hybrid profile — equal parts technical architect and humanistic thinker.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                FIELD_RECORD: Led technical instruction for 300+ graduate and undergraduate students. Designed and deployed production-grade AI pipelines. Engaged national-level stakeholders across the government–academia–industry triad.
              </p>
              <p style={{ marginBottom: "1rem" }}>
                CAPABILITY_FLAGS: Multi-agent orchestration · Agentic pipeline design · React/Vite frontend architecture · Advanced SQL & database systems · Technical education & mentorship
              </p>
              <p>
                ASSESSMENT: High-value operative. Approaches engineering with equal weight on the{" "}
                <span style={{ color: "#ff2d78" }}>why</span> and the human impact as on the{" "}
                <span style={{ color: "#00e5ff" }}>how</span><span className="cursor-blink" />
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {[
                { label: "[ RUN PROJECTS.exe ]", color: "#ff2d78", path: "/projects" },
                { label: "[ RUN CONTACT_ME.exe ]", color: "#00e5ff", path: "/contact" },
              ].map((btn) => (
                <button
                  key={btn.path}
                  onClick={() => navigate(btn.path)}
                  style={{ background: "transparent", border: `1px solid ${btn.color}`, color: btn.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.73rem", padding: "0.6rem 1.25rem", cursor: "pointer", letterSpacing: "0.04em", boxShadow: `0 0 10px ${btn.color}30`, transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${btn.color}15`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
