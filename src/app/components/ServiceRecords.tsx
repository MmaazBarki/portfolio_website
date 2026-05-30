import React, { useEffect, useRef, useState } from "react";

/* ── Circuit board background ── */
function CircuitBackground() {
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

    /* Build a grid of random H/V trace segments */
    type Trace = { x1: number; y1: number; x2: number; y2: number; horiz: boolean };
    const buildTraces = (w: number, h: number): Trace[] => {
      const traces: Trace[] = [];
      const GRID = 52;
      for (let x = 0; x < w; x += GRID) {
        for (let y = 0; y < h; y += GRID) {
          if (Math.random() > 0.45) {
            if (Math.random() > 0.5) {
              traces.push({ x1: x, y1: y, x2: x + GRID, y2: y, horiz: true });
            } else {
              traces.push({ x1: x, y1: y, x2: x, y2: y + GRID, horiz: false });
            }
          }
        }
      }
      return traces;
    };

    let traces = buildTraces(canvas.width, canvas.height);
    window.addEventListener("resize", () => {
      traces = buildTraces(canvas.width, canvas.height);
    });

    /* Signals: dots that travel along traces */
    type Signal = { traceIdx: number; progress: number; speed: number };
    const signals: Signal[] = Array.from({ length: 18 }, () => ({
      traceIdx: Math.floor(Math.random() * traces.length),
      progress: Math.random(),
      speed: 0.0004 + Math.random() * 0.0006,
    }));

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (!traces.length) { frameRef.current = requestAnimationFrame(animate); return; }

      /* Draw trace lines */
      traces.forEach((t) => {
        ctx.strokeStyle = "rgba(255,45,120,0.06)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(t.x1, t.y1);
        ctx.lineTo(t.x2, t.y2);
        ctx.stroke();

        /* Junction dot */
        ctx.beginPath();
        ctx.arc(t.x1, t.y1, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,45,120,0.1)";
        ctx.fill();
      });

      /* Draw signals */
      signals.forEach((s) => {
        s.progress = (s.progress + s.speed) % 1;
        if (s.traceIdx >= traces.length) {
          s.traceIdx = Math.floor(Math.random() * traces.length);
        }
        const t = traces[s.traceIdx];
        const p = s.progress;
        const x = t.x1 + (t.x2 - t.x1) * p;
        const y = t.y1 + (t.y2 - t.y1) * p;

        /* Signal glow */
        const g = ctx.createRadialGradient(x, y, 0, x, y, 8);
        g.addColorStop(0, "rgba(0,229,255,0.6)");
        g.addColorStop(1, "rgba(0,229,255,0)");
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,229,255,0.9)";
        ctx.fill();

        /* Reassign trace occasionally */
        if (p > 0.98 && Math.random() > 0.5) {
          s.traceIdx = Math.floor(Math.random() * traces.length);
          s.progress = 0;
        }
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
        ████ FACTION HISTORY ████
      </div>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, color: "#ffffff", textShadow: "0 0 20px rgba(255,45,120,0.3)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ color: "#ff2d78", textShadow: "0 0 8px #ff2d78" }}>&gt;</span>
        {children}
      </h2>
      <div style={{ height: 1, background: "linear-gradient(90deg, #ff2d78, #00e5ff, transparent)", marginTop: "1rem", maxWidth: 400 }} />
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", color: "#00ff9f", background: "rgba(0,255,159,0.08)", border: "1px solid rgba(0,255,159,0.25)", padding: "0.18rem 0.5rem", letterSpacing: "0.04em", textShadow: "0 0 6px #00ff9f40" }}>
      {label}
    </span>
  );
}

function ContractAccordion({ title, date, framing, bullets, badges }: { title: string; date: string; framing: string; bullets: string[]; badges: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderLeft: "1px solid rgba(0,229,255,0.2)", paddingLeft: "1.25rem", marginBottom: "1.25rem" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", textAlign: "left", padding: 0, gap: "1rem" }}
      >
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.83rem", color: "#c8c8e0", marginBottom: "0.25rem" }}>{title}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#00e5ff", textShadow: "0 0 6px #00e5ff44", letterSpacing: "0.05em" }}>{date}</div>
        </div>
        <span style={{ color: open ? "#ff2d78" : "#4a4a6a", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", flexShrink: 0, marginTop: "0.1rem" }}>
          {open ? "[ − COLLAPSE ]" : "[ + EXPAND ]"}
        </span>
      </button>

      {open && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#ff2d78", fontStyle: "italic", marginBottom: "1rem", textShadow: "0 0 6px #ff2d7444", borderLeft: "2px solid #ff2d7444", paddingLeft: "0.75rem" }}>
            {framing}
          </p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#c8c8e0", lineHeight: 1.8, marginBottom: "0.4rem", paddingLeft: "1rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#00e5ff" }}>›</span>{b}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {badges.map((b) => <Badge key={b} label={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceRecords() {
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
      id="service-records"
      ref={ref}
      style={{
        position: "relative",
        padding: "6rem 1.5rem",
        background: "rgba(3,0,8,0.98)",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,45,120,0.06)",
        borderBottom: "1px solid rgba(255,45,120,0.06)",
      }}
    >
      <CircuitBackground />

      <div className={`section-reveal${visible ? " visible" : ""}`} style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>SERVICE_RECORD</SectionLabel>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* LUMS */}
          <div
            className="cyber-card"
            style={{ border: "1px solid rgba(255,45,120,0.2)", padding: "2rem", background: "rgba(3,0,8,0.8)", boxShadow: "0 0 20px rgba(255,45,120,0.05)", backdropFilter: "blur(6px)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.62rem", color: "#ff2d78", letterSpacing: "0.15em", textShadow: "0 0 6px #ff2d78", marginBottom: "0.5rem" }}>
                  FACTION AFFILIATION
                </div>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(0.95rem, 2vw, 1.35rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                  LUMS — Lahore University of Management Sciences
                </h3>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a" }}>
                  CLEARANCE: Head Teaching Assistant · 10 months total
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#00ff9f", textShadow: "0 0 6px #00ff9f", border: "1px solid #00ff9f40", padding: "0.25rem 0.75rem", background: "rgba(0,255,159,0.05)" }}>
                ● ACTIVE CONTRACT
              </div>
            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4a6a", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              ── CONTRACT LOG ──────────────────────────
            </div>

            <ContractAccordion
              title="Contract A — Business Data Management (DISC 325)"
              date="January 2026 – Present"
              framing={`"Instructed operatives in Data Architecture and Query Optimization protocols for enterprise-grade database systems."`}
              bullets={[
                "Led academic execution and technical instruction for Business Data Management — bridging theoretical data architectures with hands-on implementation",
                "Managed a TA team, coordinating grading workflows and standardizing evaluation metrics for complex relational database assignments",
                "Instructed in advanced relational modeling, schema design, and normalization techniques",
                "Designed curriculum covering advanced SQL: recursive joins, outer joins, correlated subqueries",
                "Delivered sessions on NoSQL structures, transactional integrity, and database security",
                "Guided students in Python and Pandas for ETL pipelines and analytical reporting",
              ]}
              badges={["SQL", "PostgreSQL", "NoSQL", "Python", "Pandas", "Database Architecture", "Team Leadership"]}
            />

            <ContractAccordion
              title="Contract B — Algorithms (CS-310)"
              date="August 2025 – December 2025"
              framing={`"Trained operatives in core decryption and processing paradigms — complexity analysis, algorithmic optimization, and adversarial problem-solving."`}
              bullets={[
                "Directed academic support for the core CS Algorithms course — 300+ graduate and undergraduate students",
                "Managed and mentored 8 Teaching Assistants, ensuring consistent grading standards across the cohort",
                "Ran weekly tutorials on Dynamic Programming, Graph Theory, Greedy Algorithms, and Divide & Conquer",
                "Mentored students in Big-O complexity analysis; directly prepared them for technical interviews and competitive programming",
                "Streamlined assignment evaluation pipelines, cutting turnaround time without compromising academic integrity",
              ]}
              badges={["Algorithms", "Dynamic Programming", "Graph Theory", "Big-O Analysis", "Technical Mentorship", "8-person TA Team"]}
            />
          </div>

          {/* CeDAR */}
          <div
            className="cyber-card"
            style={{ border: "1px solid rgba(0,229,255,0.2)", padding: "1.5rem", background: "rgba(3,0,8,0.8)", boxShadow: "0 0 15px rgba(0,229,255,0.04)", maxWidth: 700, backdropFilter: "blur(6px)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", color: "#00e5ff", letterSpacing: "0.15em", textShadow: "0 0 6px #00e5ff", marginBottom: "0.4rem" }}>
                  FIELD OPERATION
                </div>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                  CeDAR, LUMS — Volunteer Operative
                </h3>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a" }}>
                  Sponsored by Allied Bank · May 2026
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a4a6a", border: "1px solid #4a4a6a40", padding: "0.25rem 0.75rem" }}>
                ONE-TIME CONTRACT
              </div>
            </div>

            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#ff2d78", fontStyle: "italic", marginBottom: "1rem", borderLeft: "2px solid #ff2d7844", paddingLeft: "0.75rem", textShadow: "0 0 6px #ff2d7444" }}>
              "Embedded operative at a national intelligence summit — extracting strategic intelligence from government, academia, and industry factions on blockchain infrastructure and digital asset policy."
            </p>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#c8c8e0", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              {[
                "Acted as primary interviewer at a premier national summit — facilitated discussions with policymakers, finance executives, and academic leaders",
                "Synthesized perspectives across government–academia–industry triad on blockchain and digital asset policy in Pakistan",
                "Bridged deep technical blockchain implementation and high-level economic policy discourse",
                "Demonstrated professional networking and communication in a high-profile, multi-sector environment",
              ].map((b, i) => (
                <div key={i} style={{ marginBottom: "0.4rem" }}>
                  <span style={{ color: "#00e5ff" }}>› </span>{b}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {["Blockchain", "Digital Policy", "Public Speaking", "Cross-sector Networking"].map((b) => (
                <Badge key={b} label={b} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
