import React, { useEffect, useRef, useState } from "react";

/* ── Matrix rain background ── */
function MatrixBackground() {
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

    const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ0x>_{}[]|#$@";
    const FONT_SIZE = 14;
    let cols = Math.floor(canvas.width / FONT_SIZE);
    let drops: number[] = Array.from({ length: cols }, () => Math.random() * -50);

    window.addEventListener("resize", () => {
      cols = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: cols }, (_, i) => drops[i] ?? Math.random() * -50);
    });

    const animate = () => {
      const { width, height } = canvas;

      ctx.fillStyle = "rgba(3,0,8,0.075)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] <= 0) {
          drops[i] += Math.random() < 0.02 ? 0.5 : 0;
          continue;
        }

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * FONT_SIZE;
        const x = i * FONT_SIZE;

        const isHead = Math.random() > 0.85;
        if (isHead) {
          ctx.fillStyle = "rgba(200,255,220,0.55)";
        } else {
          const fade = Math.min(1, drops[i] / 8);
          ctx.fillStyle = `rgba(0,229,255,${0.04 + fade * 0.07})`;
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.97) {
          drops[i] = 0;
        }
        drops[i] += 0.4;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frameRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", color: "#4a4a6a", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
        ████ COMM-LINK ████
      </div>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 700, color: "#ffffff", textShadow: "0 0 20px rgba(255,45,120,0.3)", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ color: "#ff2d78", textShadow: "0 0 8px #ff2d78" }}>&gt;</span>
        {children}
      </h2>
      <div style={{ height: 1, background: "linear-gradient(90deg, #ff2d78, #00e5ff, transparent)", marginTop: "1rem", maxWidth: 400 }} />
    </div>
  );
}

function TerminalInput({ label, type = "text", value, onChange, multiline = false }: { label: string; type?: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const [focused, setFocused] = useState(false);
  const baseStyle = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: `1px solid ${focused ? "#00e5ff" : "rgba(74,74,106,0.5)"}`,
    color: "#c8c8e0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem",
    padding: "0.5rem 0", outline: "none", caretColor: "#00e5ff",
    transition: "border-color 0.2s", resize: "none" as const,
    boxShadow: focused ? "0 2px 0 rgba(0,229,255,0.15)" : "none",
  };
  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: focused ? "#00e5ff" : "#4a4a6a", letterSpacing: "0.08em", marginBottom: "0.4rem", textShadow: focused ? "0 0 6px #00e5ff44" : "none", transition: "color 0.2s" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: focused ? "#00e5ff" : "#4a4a6a", paddingTop: "0.5rem", transition: "color 0.2s", textShadow: focused ? "0 0 6px #00e5ff" : "none" }}>&gt;</span>
        {multiline ? (
          <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...baseStyle, display: "block" }} />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={baseStyle} />
        )}
      </div>
    </div>
  );
}

export function SecureChannel() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const [sessionToken] = useState(() => Math.random().toString(16).slice(2, 10).toUpperCase());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setTransmitting(true);
    setTimeout(() => { setTransmitting(false); setSubmitted(true); }, 1800);
  };

  return (
    <section
      id="secure-channel"
      ref={ref}
      style={{
        position: "relative",
        padding: "6rem 1.5rem 8rem",
        background: "rgba(0,3,6,0.98)",
        borderTop: "1px solid rgba(0,229,255,0.05)",
        overflow: "hidden",
      }}
    >
      <MatrixBackground />

      <div className={`section-reveal${visible ? " visible" : ""}`} style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>OPEN_CHANNEL.exe</SectionLabel>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start" }}>
          {/* Form */}
          <div style={{ background: "rgba(0,3,6,0.7)", border: "1px solid rgba(0,229,255,0.1)", padding: "2rem", backdropFilter: "blur(8px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#00ff9f", textShadow: "0 0 6px #00ff9f44", marginBottom: "2rem", letterSpacing: "0.05em" }}>
              &gt; ESTABLISHING SECURE CONNECTION...{" "}
              <span style={{ color: "#00ff9f", textShadow: "0 0 8px #00ff9f" }}>[ OK ]</span>
            </div>

            {submitted ? (
              <div className="terminal-fadein" style={{ border: "1px solid rgba(0,255,159,0.3)", padding: "2rem", background: "rgba(0,255,159,0.04)", fontFamily: "'JetBrains Mono', monospace" }}>
                <div style={{ fontSize: "0.75rem", color: "#00ff9f", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>&gt; TRANSMISSION CONFIRMED</div>
                <div style={{ fontSize: "0.83rem", color: "#c8c8e0", lineHeight: 1.8 }}>Message received, operative. Channel closing.<br />Response within 24–48 standard hours.</div>
                <div style={{ fontSize: "0.68rem", color: "#4a4a6a", marginTop: "1rem" }}>&gt; CONNECTION TERMINATED · SECURE WIPE INITIATED</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <TerminalInput label="SENDER_ID:" value={name} onChange={setName} />
                <TerminalInput label="RETURN_FREQ:" type="email" value={email} onChange={setEmail} />
                <TerminalInput label="MESSAGE_BODY:" value={message} onChange={setMessage} multiline />
                <button
                  type="submit"
                  disabled={transmitting || !name || !email || !message}
                  style={{ background: "transparent", border: `1px solid ${transmitting ? "#4a4a6a" : "#ff2d78"}`, color: transmitting ? "#4a4a6a" : "#ff2d78", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", padding: "0.75rem 2rem", cursor: transmitting || !name || !email || !message ? "not-allowed" : "pointer", letterSpacing: "0.08em", boxShadow: transmitting ? "none" : "0 0 12px #ff2d7840", transition: "all 0.2s", width: "100%" }}
                  onMouseEnter={(e) => { if (!transmitting) (e.currentTarget as HTMLButtonElement).style.background = "#ff2d7815"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {transmitting ? <span>&gt; ENCRYPTING <span style={{ animation: "blink 0.5s step-end infinite" }}>█</span></span> : "[ TRANSMIT ]"}
                </button>
              </form>
            )}
          </div>

          {/* Direct channels */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4a4a6a", letterSpacing: "0.15em", marginBottom: "1.5rem" }}>
              ── DIRECT CHANNELS ───────────────────────
            </div>

            {[
              { label: "EMAIL",    value: "maazbarki@gmail.com",                href: "mailto:maazbarki@gmail.com",                          color: "#ff2d78" },
              { label: "LINKEDIN", value: "linkedin.com/in/muhammad-maaz-barki", href: "https://www.linkedin.com/in/muhammad-maaz-barki/",     color: "#00e5ff" },
              { label: "LOCATION", value: "Lahore / Multan, Pakistan",           href: null,                                                   color: "#00ff9f" },
            ].map((ch) => (
              <div key={ch.label} style={{ marginBottom: "1.5rem", borderLeft: `2px solid ${ch.color}40`, paddingLeft: "1rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4a6a", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{ch.label}:</div>
                {ch.href ? (
                  <a
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: ch.color, textDecoration: "none", textShadow: `0 0 6px ${ch.color}44`, display: "flex", alignItems: "center", gap: "0.4rem", transition: "text-shadow 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textShadow = `0 0 12px ${ch.color}88`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textShadow = `0 0 6px ${ch.color}44`; }}
                  >
                    &gt; {ch.value}
                  </a>
                ) : (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: ch.color, textShadow: `0 0 6px ${ch.color}44` }}>
                    &gt; {ch.value}
                  </div>
                )}
              </div>
            ))}

            {/* System readout */}
            <div style={{ marginTop: "3rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#4a4a6a", lineHeight: 2, borderTop: "1px solid rgba(74,74,106,0.2)", paddingTop: "1.5rem" }}>
              <div>&gt; SESSION_TOKEN: 0x{sessionToken}</div>
              <div>&gt; PROTOCOL: RSA-4096 · AES-256-GCM</div>
              <div>&gt; NODE: LAHORE.PKR.01 · UPTIME: 99.9%</div>
              <div className="cursor-blink">&gt; AWAITING INPUT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "4rem auto 0", borderTop: "1px solid rgba(74,74,106,0.15)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4a4a6a" }}>
          &copy; 2026 BARKI, MUHAMMAD MAAZ · ALL RIGHTS RESERVED
        </div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem", color: "#ff2d78", letterSpacing: "0.1em", textShadow: "0 0 6px #ff2d7844" }}>
          BARKI_M · OPERATIVE PROFILE v2.6
        </div>
      </div>
    </section>
  );
}
