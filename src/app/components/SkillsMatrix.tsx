import { useEffect, useRef, useState } from "react";

/* ── Hex grid background ── */
function HexBackground() {
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

    const drawHex = (cx: number, cy: number, r: number, alpha: number, color: string) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = color.replace("$a", String(alpha));
      ctx.lineWidth = 0.6;
      ctx.stroke();
    };

    const start = performance.now();
    const animate = (now: number) => {
      const t = (now - start) / 1000;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const R = 32;
      const W = R * 2;
      const H = Math.sqrt(3) * R;
      const cols = Math.ceil(width / (W * 0.75)) + 2;
      const rows = Math.ceil(height / H) + 2;

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * W * 0.75;
          const cy = row * H + (col % 2 === 0 ? 0 : H / 2);

          const wave = (Math.sin(t * 0.4 + col * 0.4 + row * 0.6) + 1) * 0.5;
          const wave2 = (Math.sin(t * 0.25 - col * 0.3 + row * 0.4) + 1) * 0.5;
          const combined = wave * wave2;

          const alpha = 0.03 + combined * 0.11;
          const colorChoice = (col + row + Math.floor(t * 0.1)) % 3;
          const color = colorChoice === 0 ? `rgba(0,229,255,$a)` : colorChoice === 1 ? `rgba(255,45,120,$a)` : `rgba(0,255,159,$a)`;

          drawHex(cx, cy, R - 1, alpha, color);

          if (combined > 0.85) {
            ctx.fillStyle = color.replace("$a", String(alpha * 0.3));
            ctx.fill();
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7 }} />;
}

/* ── Data ── */
const SKILL_CATEGORIES = [
  {
    label: "DATA & DATABASES",
    color: "#00e5ff",
    icon: "◈",
    skills: ["SQL", "MongoDB", "NoSQL", "PostgreSQL", "Relational Databases", "Database Design", "DBMS", "Data Analysis", "Databases", "Cloudinary"],
  },
  {
    label: "LANGUAGES & TOOLS",
    color: "#00ff9f",
    icon: "◈",
    skills: ["C/C++", "Python", "TypeScript", "C#", "Haskell", "React.js", "Node.js", "Express.js", "Pandas", "NumPy", "Matplotlib", "Three.js", "Git", "Selenium", "REST APIs", "Web Development"],
  },
  {
    label: "ALGORITHMS & CS",
    color: "#ff2d78",
    icon: "◈",
    skills: ["Algorithms", "Algorithm Analysis", "Algorithm Design", "Data Structures", "SIFT", "Structure-from-Motion (SfM)", "Causal Inference", "Network Centric Computing"],
  },
  {
    label: "AI & MACHINE LEARNING",
    color: "#b44fff",
    icon: "◈",
    skills: ["PyTorch", "Scikit-learn", "LangChain", "Unsloth", "Transformers", "RAG", "BERTScore", "NLP", "Large Language Models (LLM)", "Machine Learning", "Computer Vision", "OpenCV"],
  },
  {
    label: "CLOUD & INFRASTRUCTURE",
    color: "#00e5ff",
    icon: "◈",
    skills: ["Microsoft Azure", "Docker", "Redis", "Firebase"],
  },
  {
    label: "LEADERSHIP & EDUCATION",
    color: "#ffb700",
    icon: "◈",
    skills: ["Team Leadership", "Technical Leadership", "Teaching", "Technical Mentorship"],
  },
];

function SkillBadge({ label, color }: { label: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.68rem",
        color: hovered ? "#000" : color,
        background: hovered ? color : `${color}12`,
        border: `1px solid ${color}${hovered ? "ff" : "35"}`,
        padding: "0.25rem 0.65rem",
        letterSpacing: "0.04em",
        textShadow: hovered ? "none" : `0 0 6px ${color}30`,
        boxShadow: hovered ? `0 0 14px ${color}60` : "none",
        transition: "all 0.18s ease",
        cursor: "default",
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function CategoryCard({ label, color, icon, skills }: typeof SKILL_CATEGORIES[0]) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        border: `1px solid ${color}25`,
        background: `${color}05`,
        padding: "1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        boxShadow: `0 0 20px ${color}08`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ color, textShadow: `0 0 8px ${color}` }}>{icon}</span>
        <span
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.6rem",
            color,
            letterSpacing: "0.12em",
            textShadow: `0 0 6px ${color}60`,
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {skills.map((s) => <SkillBadge key={s} label={s} color={color} />)}
      </div>
    </div>
  );
}

export function SkillsMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        background: "rgba(0,0,0,0.95)",
        borderTop: "1px solid rgba(0,229,255,0.06)",
        overflow: "hidden",
      }}
    >
      <HexBackground />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        {/* Heading */}
        <div className={`section-reveal${visible ? " visible" : ""}`} style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
            ████ AUGMENTATION LOG ████
          </div>
          <h2
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 0 20px rgba(255,45,120,0.3)",
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ color: "#ff2d78", textShadow: "0 0 8px #ff2d78" }}>&gt;</span>
            CAPABILITY_MATRIX.exe
          </h2>
          <div style={{ height: 1, background: "linear-gradient(90deg, #ff2d78, #00e5ff, transparent)", marginTop: "1rem", maxWidth: 400 }} />
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {SKILL_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.label} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
