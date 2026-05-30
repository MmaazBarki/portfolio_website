import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./Navigation";

/* ── Page order & labels ── */
export const PAGE_SEQUENCE = ["/", "/profile", "/service", "/projects", "/contact"];

export const PAGE_META: Record<string, { label: string; short: string }> = {
  "/":          { label: "INITIALIZE",       short: "HOME"     },
  "/profile":   { label: "ABOUT ME",short: "PROFILE"  },
  "/service":   { label: "EXPERIENCE and VOLUNTEERING",   short: "SERVICE"  },
  "/projects":  { label: "PROJECTS",    short: "PROJECTS" },
  "/contact":   { label: "CONTACT ME",     short: "CONTACT"  },
};

/* ── Ambient CRT flicker ── */
function useAmbientFlicker(ref: { current: HTMLDivElement | null }) {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const doFlicker = () => {
      const el = ref.current;
      if (!el) { timeout = setTimeout(doFlicker, 4000); return; }
      const strong = Math.random() < 0.15;
      const steps: [number, string][] = strong
        ? [[0,"0.96"],[35,"1"],[70,"0.88"],[110,"1"],[145,"0.93"],[185,"0.97"],[220,"1"]]
        : [[0,"0.975"],[40,"1"],[75,"0.96"],[115,"1"]];
      steps.forEach(([delay, val]) => {
        setTimeout(() => { if (ref.current) ref.current.style.opacity = val; }, delay);
      });
      timeout = setTimeout(doFlicker, 3500 + Math.random() * 8500);
    };
    timeout = setTimeout(doFlicker, 1200 + Math.random() * 3000);
    return () => clearTimeout(timeout);
  }, [ref]);
}

/* ── Bottom page navigator ── */
function PageNavigator() {
  const location = useLocation();
  const navigate = useNavigate();
  const idx = PAGE_SEQUENCE.indexOf(location.pathname);
  const currentIdx = idx === -1 ? 0 : idx;
  const prev = currentIdx > 0 ? PAGE_SEQUENCE[currentIdx - 1] : null;
  const next = currentIdx < PAGE_SEQUENCE.length - 1 ? PAGE_SEQUENCE[currentIdx + 1] : null;

  const btnBase: React.CSSProperties = {
    background: "none",
    border: "1px solid rgba(74,74,106,0.35)",
    cursor: "pointer",
    color: "#4a4a6a",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.62rem",
    padding: "0.38rem 1rem",
    letterSpacing: "0.06em",
    transition: "all 0.18s ease",
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 998,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0.55rem 1.5rem",
      background: "rgba(0,0,0,0.92)",
      borderTop: "1px solid rgba(0,229,255,0.07)",
      backdropFilter: "blur(10px)",
    }}>
      {prev ? (
        <button
          style={btnBase}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = "#00e5ff"; b.style.borderColor = "rgba(0,229,255,0.5)"; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = "#4a4a6a"; b.style.borderColor = "rgba(74,74,106,0.35)"; }}
          onClick={() => navigate(prev)}
        >
          ← [ {PAGE_META[prev].label} ]
        </button>
      ) : <div style={{ width: 180 }} />}

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#4a4a6a", letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {PAGE_SEQUENCE.map((p, i) => (
          <span
            key={p}
            onClick={() => navigate(p)}
            style={{ cursor: "pointer", width: 6, height: 6, borderRadius: "50%", display: "inline-block", background: i === currentIdx ? "#ff2d78" : "rgba(74,74,106,0.4)", boxShadow: i === currentIdx ? "0 0 6px #ff2d78" : "none", transition: "all 0.2s" }}
          />
        ))}
        <span style={{ marginLeft: "0.4rem" }}>
          {String(currentIdx + 1).padStart(2, "0")}/{String(PAGE_SEQUENCE.length).padStart(2, "0")}
        </span>
      </div>

      {next ? (
        <button
          style={btnBase}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = "#ff2d78"; b.style.borderColor = "rgba(255,45,120,0.5)"; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = "#4a4a6a"; b.style.borderColor = "rgba(74,74,106,0.35)"; }}
          onClick={() => navigate(next)}
        >
          [ {PAGE_META[next].label} ] →
        </button>
      ) : <div style={{ width: 180 }} />}
    </div>
  );
}

/* ── Root layout ── */
export function Root() {
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useAmbientFlicker(wrapperRef);

  return (
    <div
      ref={wrapperRef}
      style={{ background: "#000000", minHeight: "100vh", color: "#c8c8e0", fontFamily: "'JetBrains Mono', monospace", willChange: "opacity" }}
    >
      <Navigation />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
          exit={  { opacity: 0, y: -8,  filter: "blur(4px)" }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          style={{ paddingBottom: "52px" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      <PageNavigator />
    </div>
  );
}
