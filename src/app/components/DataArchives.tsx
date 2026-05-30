import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ── PROJECT COVER IMAGES ────────────────────────────────────────────────────
// To update: replace files at src/imports/
import simulacraCover  from "../../imports/cropped_cover.png";
import chironCover     from "../../imports/Chiron_cover.png";
import lihCover        from "../../imports/ProductShowcase.png";
import chatbotCover    from "../../imports/RomanUrdu_MedicalChatbot_cover.jpg";
// ────────────────────────────────────────────────────────────────────────────

/* ── Network node background ── */
function NetworkBackground() {
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
    const NUM = 55;
    const particles = Array.from({ length: NUM }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00008, vy: (Math.random() - 0.5) * 0.00008 }));
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const pts = particles.map(p => ({ x: ((p.x + p.vx * elapsed) % 1 + 1) % 1 * width, y: ((p.y + p.vy * elapsed) % 1 + 1) % 1 * height }));
      const DIST = Math.min(width, height) * 0.22;
      for (let i = 0; i < NUM; i++) {
        for (let j = i + 1; j < NUM; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) { ctx.strokeStyle = `rgba(0,229,255,${(1 - d / DIST) * 0.07})`; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
      }
      pts.forEach((p, i) => {
        const pulse = (Math.sin((now / 1000) * 0.8 + i * 0.7) + 1) * 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? `rgba(255,45,120,${0.1 + pulse * 0.14})` : `rgba(0,229,255,${0.1 + pulse * 0.14})`;
        ctx.fill();
      });
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

/* ── Data ── */
interface Collaborator { name: string; url: string; }
interface Project {
  id: string;
  classification: string;
  title: string;
  tagline: string;
  description: string;
  contributions: Array<{ area: string; detail: string }>;
  highlights: string[];
  techBadges: string[];
  githubUrl: string;
  liveUrl: string;
  collaborators: Collaborator[];
  coverImage: string;
  coverAlt: string;
}

const COLLABORATORS: Collaborator[] = [
  { name: "Hassan Zaidi",           url: "https://www.linkedin.com/in/hassan-zaidi04/" },
  { name: "Muhammad Talha Yaseen",  url: "https://www.linkedin.com/in/muhammad-talha-yaseen/" },
  { name: "Ehmad Saeed",            url: "https://www.linkedin.com/in/justehmadsaeed/" },
];

const PROJECTS: Project[] = [
  {
    id: "simulacra",
    classification: "Usability Research Platform",
    title: "SIMULACRA",
    tagline: "Deploy synthetic operatives to stress-test your product before your users do.",
    description: "Simulacra deploys synthetic user personas against your product's live URLs — each narrating what they perceive, where they're confused, and what works. An HCI analysis layer maps observations to structured friction scores and design-ready findings. Ship with confidence. No scheduling. No recruiting. Repeatable on demand.",
    contributions: [
      { area: "FRONTEND", detail: "Built the React/Vite dashboard from scratch — all UI, routing, state management, and WebSocket integration for live agent visibility" },
      { area: "PERSONA ENGINE", detail: "Defined all persona logic — segment-aware synthetic user profiles (explorer, power user, cautious adopter) that determine how agents reason and narrate" },
    ],
    highlights: [
      "Segment-aware personas modelling skill levels, patience, and reading habits",
      "Full React/Vite dashboard with live WebSocket agent progress streams",
      "Multi-agent orchestration with LangGraph-style UX research workflows",
      "Typed OpenAPI contracts between frontend and backend (Turborepo monorepo)",
      "Redis pub/sub + Postgres for production data plane",
    ],
    techBadges: ["TypeScript", "React", "Vite", "FastAPI", "Python", "LangGraph", "Redis", "PostgreSQL", "Docker", "WebSockets"],
    githubUrl: "https://github.com/justEhmadSaeed/simulacra",
    liveUrl: "https://simulacra.ehmad.dev",
    collaborators: COLLABORATORS,
    coverImage: simulacraCover,
    coverAlt: "SIMULACRA — AI-Driven Usability Research Platform",
  },
  {
    id: "chiron",
    classification: "Scientific Research Orchestrator",
    title: "CHIRON",
    tagline: "Adversarial agents that stress-test your hypothesis before you waste a lab on it.",
    description: "Chiron validates whether a scientific hypothesis is actually novel before you invest lab time. A team of adversarial agents independently reviews the literature and attacks the hypothesis from different angles. Once novelty is confirmed, Chiron dynamically generates a multi-week experimental protocol using a RAG system that sharpens itself from expert feedback — without retraining.",
    contributions: [
      { area: "AGENTIC PIPELINE", detail: "Designed and built the complete multi-agent workflow — mapped inputs/outputs, defined agent roles, orchestrated adversarial literature review, wired continuous-learning RAG feedback loop" },
      { area: "INTEGRATION", detail: "Integrated all backend APIs with the React/Vite frontend — clean data contracts and reliable real-time communication between agent workers and UI" },
    ],
    highlights: [
      "Adversarial multi-agent hypothesis validation — pipeline design + orchestration",
      "Continuous-learning RAG for experimental protocol generation",
      "Full API-to-frontend integration with real-time communication",
      "Firebase Realtime Database for live session persistence",
      "OpenTelemetry instrumentation for full audit trails",
      "Decoupled API + Worker architecture, independently scaled via Redis",
    ],
    techBadges: ["TypeScript", "Python", "React", "FastAPI", "LangChain", "RAG", "Firebase", "Redis", "OpenTelemetry", "Docker"],
    githubUrl: "https://github.com/justEhmadSaeed/chiron",
    liveUrl: "https://chiron.ehmad.dev",
    collaborators: COLLABORATORS,
    coverImage: chironCover,
    coverAlt: "CHIRON — AI Experiment Architect",
  },
  {
    id: "lih",
    classification: "Full-Stack Web Platform",
    title: "LUMS INFO HUB",
    tagline: "The unified information backbone for an entire university community.",
    description: "LUMS Information Hub (LIH) is a full-stack MERN platform serving as the central information repository for LUMS students, faculty, and staff. Architected for scalability from the ground up — from MongoDB schema design to a responsive React frontend — with automated quality gates via Selenium to protect critical user flows in production.",
    contributions: [
      { area: "TECHNICAL LEAD", detail: "Sole architect of the full-stack system — owned requirements, schema design, REST API layer, media pipeline, and frontend implementation end-to-end" },
      { area: "BACKEND", detail: "Designed scalable MongoDB schemas and implemented RESTful API endpoints using Node.js/Express; integrated Cloudinary for optimised media storage and delivery" },
      { area: "QA", detail: "Devised an automated Selenium test suite covering authentication, content submission, and access-control critical user flows" },
    ],
    highlights: [
      "Technical Lead — sole architect across the full MERN stack",
      "Scalable MongoDB schema design with RESTful Node.js/Express API",
      "Cloudinary integration for optimised media storage and delivery",
      "Responsive React UI with component-driven architecture",
      "Selenium automated test suite covering authentication and submission flows",
    ],
    techBadges: ["MongoDB", "Express.js", "React.js", "Node.js", "Selenium", "Cloudinary", "Git", "REST APIs"],
    githubUrl: "https://github.com/MmaazBarki",
    liveUrl: "https://github.com/MmaazBarki",
    collaborators: [],
    coverImage: lihCover,
    coverAlt: "LUMS Information Hub — Full-Stack MERN Platform",
  },
  {
    id: "chatbot",
    classification: "AI · NLP · Healthcare",
    title: "ROMAN-URDU MEDICAL CHATBOT",
    tagline: "Speak in Urdu, get clinical-grade advice — no hallucinations, no guesswork.",
    description: "A speech-first medical advisory pipeline that processes Urdu audio, transcribes it to Roman Urdu text, and routes it through a RAG-augmented LLM for health guidance. Purpose-built to serve communities where healthcare access and literacy barriers collide. Hallucinations are actively suppressed via Sentence-Transformer grounding, and model performance is validated with BERTScore at the diagnostic level.",
    contributions: [
      { area: "STT PIPELINE", detail: "Developed the Speech-to-Text medical pipeline that processes Urdu audio and converts it to Roman Urdu text for downstream NLP" },
      { area: "RAG SYSTEM", detail: "Built the RAG system using LangChain and Sentence-Transformers to ground LLM responses in verified medical context, directly mitigating hallucinations" },
      { area: "MODEL OPT.", detail: "Fine-tuned and optimised 1B/3B Llama and 7B Qwen models using Unsloth for memory-efficient training and faster inference on constrained hardware" },
    ],
    highlights: [
      "End-to-end Urdu Speech-to-Text → Roman Urdu → LLM medical advisory pipeline",
      "RAG system with LangChain + Sentence-Transformers for hallucination mitigation",
      "1B/3B Llama and 7B Qwen fine-tuned via Unsloth — memory-efficient on constrained hardware",
      "BERTScore evaluation for diagnostic accuracy and text fidelity",
      "Designed for underserved communities with language and literacy barriers",
    ],
    techBadges: ["Python", "LangChain", "Unsloth", "Transformers", "Sentence-Transformers", "BERTScore", "RAG", "NLP"],
    githubUrl: "https://github.com/MmaazBarki",
    liveUrl: "https://github.com/MmaazBarki",
    collaborators: [],
    coverImage: chatbotCover,
    coverAlt: "Roman-Urdu Medical Chatbot — Speech-to-Text AI Health Advisory",
  },
];

/* ── Small project card ── */
function SmallCard({
  project, isHovered, isBlurred, onHover, onLeave, onClick,
}: {
  project: Project;
  isHovered: boolean;
  isBlurred: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${isHovered ? "rgba(255,45,120,0.55)" : "rgba(255,45,120,0.15)"}`,
        background: isHovered ? "rgba(255,45,120,0.05)" : "rgba(4,4,14,0.88)",
        backdropFilter: "blur(4px)",
        transform: isHovered ? "scale(1.045)" : isBlurred ? "scale(0.94)" : "scale(1)",
        filter: isBlurred ? "blur(3.5px)" : "none",
        opacity: isBlurred ? 0.52 : 1,
        boxShadow: isHovered ? "0 0 40px rgba(255,45,120,0.18), 0 8px 32px rgba(0,0,0,0.5)" : "0 0 12px rgba(0,0,0,0.4)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        zIndex: isHovered ? 2 : 1,
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
        <ImageWithFallback
          src={project.coverImage}
          alt={project.coverAlt}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: isHovered ? "saturate(0.9) brightness(0.7)" : "saturate(0.6) brightness(0.55) contrast(1.05)", transition: "filter 0.35s ease" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 20%, rgba(4,4,14,0.98) 100%)" }} />
        {/* Classification label */}
        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#ff2d78", letterSpacing: "0.1em", textShadow: "0 0 6px #ff2d78", background: "rgba(0,0,0,0.7)", padding: "0.18rem 0.5rem", border: "1px solid rgba(255,45,120,0.25)" }}>
          ██ {project.classification.toUpperCase()}
        </div>
        {/* Click hint */}
        {isHovered && (
          <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#00e5ff", background: "rgba(0,0,0,0.7)", padding: "0.18rem 0.5rem", border: "1px solid rgba(0,229,255,0.3)", letterSpacing: "0.06em" }}>
            CLICK TO DECRYPT
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "1.25rem 1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3
          className="glitch-hover"
          data-text={project.title}
          style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "0.07em", marginBottom: "0.5rem", textShadow: isHovered ? "0 0 20px rgba(255,45,120,0.5)" : "none", transition: "text-shadow 0.3s" }}
        >
          {project.title}
        </h3>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#ff2d78", fontStyle: "italic", marginBottom: "1rem", textShadow: "0 0 6px #ff2d7840", lineHeight: 1.5 }}>
          "{project.tagline}"
        </p>

        {/* First 5 tech badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "auto" }}>
          {project.techBadges.slice(0, 5).map(t => (
            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#00ff9f", background: "#111", border: "1px solid rgba(0,255,159,0.2)", padding: "0.15rem 0.45rem", letterSpacing: "0.04em" }}>
              {t}
            </span>
          ))}
          {project.techBadges.length > 5 && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4a6a", padding: "0.15rem 0.45rem" }}>
              +{project.techBadges.length - 5} more
            </span>
          )}
        </div>

        <button
          style={{ marginTop: "1.1rem", background: "transparent", border: `1px solid ${isHovered ? "#ff2d78" : "rgba(255,45,120,0.25)"}`, color: isHovered ? "#ff2d78" : "#4a4a6a", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", padding: "0.5rem", cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.25s", boxShadow: isHovered ? "0 0 12px #ff2d7840" : "none" }}
        >
          {isHovered ? "[ DECRYPT ARCHIVE ]" : "[ LOCKED — CLICK TO DECRYPT ]"}
        </button>
      </div>
    </div>
  );
}

/* ── Full detail modal ── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "80px 1rem 80px" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", backdropFilter: "blur(10px)", zIndex: 0 }} />

      {/* Modal content */}
      <div
        className="terminal-fadein"
        style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 820, border: "1px solid rgba(255,45,120,0.35)", background: "rgba(4,4,14,0.97)", boxShadow: "0 0 60px rgba(255,45,120,0.15), 0 20px 60px rgba(0,0,0,0.8)" }}
      >
        {/* Cover image header */}
        <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
          <ImageWithFallback
            src={project.coverImage}
            alt={project.coverAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.8) brightness(0.6)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(4,4,14,0.97) 100%)" }} />
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,45,120,0.5)", color: "#ff2d78", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", padding: "0.35rem 0.8rem", cursor: "pointer", letterSpacing: "0.06em", zIndex: 2, transition: "all 0.18s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ff2d7820"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.8)"; }}
          >
            [ × CLOSE ]
          </button>
          {/* Classification */}
          <div style={{ position: "absolute", top: "1rem", left: "1rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#ff2d78", letterSpacing: "0.1em", textShadow: "0 0 6px #ff2d78", background: "rgba(0,0,0,0.7)", padding: "0.2rem 0.6rem", border: "1px solid rgba(255,45,120,0.3)" }}>
            ██ CLASSIFIED · {project.classification.toUpperCase()}
          </div>
        </div>

        <div style={{ padding: "1.75rem 2rem 2rem" }}>
          {/* Title */}
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "0.06em", textShadow: "0 0 20px rgba(255,45,120,0.4)", marginBottom: "0.6rem" }}>
            {project.title}
          </h2>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#ff2d78", fontStyle: "italic", marginBottom: "1.25rem", textShadow: "0 0 6px #ff2d7840" }}>
            "{project.tagline}"
          </p>

          <div style={{ height: 1, background: "linear-gradient(90deg, #ff2d78, #00e5ff, transparent)", marginBottom: "1.5rem", maxWidth: 300 }} />

          {/* Description */}
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#c8c8e0", lineHeight: 1.9, marginBottom: "1.5rem" }}>
            {project.description}
          </p>

          {/* Co-operatives — only shown when the project has collaborators */}
          {project.collaborators.length > 0 && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4a4a6a", marginBottom: "1.5rem", borderLeft: "1px solid rgba(0,229,255,0.15)", paddingLeft: "0.75rem" }}>
              <span>CO-OPERATIVES: </span>
              {project.collaborators.map((c, i) => (
                <span key={c.name}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#00e5ff", textDecoration: "none", textShadow: "0 0 6px #00e5ff44", transition: "text-shadow 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.textShadow = "0 0 10px #00e5ff88"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.textShadow = "0 0 6px #00e5ff44"; }}
                  >
                    {c.name}
                  </a>
                  {i < project.collaborators.length - 1 && <span style={{ color: "#4a4a6a" }}> · </span>}
                </span>
              ))}
            </div>
          )}

          {/* Contributions */}
          <div style={{ marginBottom: "1.5rem", borderLeft: "2px solid rgba(0,229,255,0.2)", paddingLeft: "1rem" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#00e5ff", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>MY_CONTRIBUTIONS.log</div>
            {project.contributions.map((c, i) => (
              <div key={i} style={{ marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#00ff9f" }}>[{c.area}] </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#c8c8e0" }}>{c.detail}</span>
              </div>
            ))}
          </div>

          {/* Expandable highlights */}
          <button onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4a4a6a", textAlign: "left", padding: 0, marginBottom: expanded ? "0.75rem" : "1.5rem", transition: "color 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#c8c8e0"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#4a4a6a"; }}
          >
            {expanded ? "[ − HIDE SYSTEM_SPECS ]" : "[ + REVEAL SYSTEM_SPECS ]"}
          </button>
          {expanded && (
            <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
              {project.highlights.map((h, i) => (
                <li key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#c8c8e0", lineHeight: 1.8, paddingLeft: "1rem", position: "relative", marginBottom: "0.25rem" }}>
                  <span style={{ position: "absolute", left: 0, color: "#00e5ff" }}>›</span>{h}
                </li>
              ))}
            </ul>
          )}

          {/* Tech badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.75rem" }}>
            {project.techBadges.map(t => (
              <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#00ff9f", background: "#111", border: "1px solid rgba(0,255,159,0.2)", padding: "0.18rem 0.5rem", letterSpacing: "0.04em", textShadow: "0 0 4px #00ff9f30" }}>
                {t}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#c8c8e0", textDecoration: "none", border: "1px solid rgba(200,200,224,0.2)", padding: "0.55rem 1.1rem", background: "transparent", letterSpacing: "0.04em", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,200,224,0.5)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,200,224,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,200,224,0.2)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              [ ACCESS ARCHIVE → GitHub ]
            </a>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#00ff9f", textDecoration: "none", border: "1px solid rgba(0,255,159,0.3)", padding: "0.55rem 1.1rem", background: "rgba(0,255,159,0.05)", letterSpacing: "0.04em", textShadow: "0 0 6px #00ff9f44", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,255,159,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,255,159,0.05)"; }}
            >
              [ RUN CONSTRUCT → Live ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ── */
export function DataArchives() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const selectedProject = selectedId ? PROJECTS.find(p => p.id === selectedId) ?? null : null;

  return (
    <section
      id="data-archives"
      ref={ref}
      style={{ position: "relative", padding: "6rem 1.5rem 4rem", background: "rgba(2,2,10,0.98)", overflow: "hidden", minHeight: "100vh" }}
    >
      <NetworkBackground />

      <div className={`section-reveal${visible ? " visible" : ""}`} style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        {/* Section label */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>████ NEURAL CONSTRUCTS ████</div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, color: "#ffffff", textShadow: "0 0 20px rgba(255,45,120,0.3)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: "#ff2d78", textShadow: "0 0 8px #ff2d78" }}>&gt;</span>
            PROJECTS
          </h2>
          <div style={{ height: 1, background: "linear-gradient(90deg, #ff2d78, #00e5ff, transparent)", marginTop: "1rem", maxWidth: 400 }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4a4a6a", marginTop: "0.75rem" }}>
            HOVER to bring into focus · CLICK to decrypt full archive
          </div>
        </div>

        {/* Cards grid: 2 per row on wide screens, 1 on narrow */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: "1.75rem",
          position: "relative",
        }}>
          {PROJECTS.map(p => (
            <SmallCard
              key={p.id}
              project={p}
              isHovered={hoveredId === p.id}
              isBlurred={hoveredId !== null && hoveredId !== p.id}
              onHover={() => setHoveredId(p.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedId(null)} />}
    </section>
  );
}
