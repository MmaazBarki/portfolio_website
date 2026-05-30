import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

const NAV_ITEMS = [
  { label: "> INITIALIZE",         path: "/"         },
  { label: "> OPERATIVE_PROFILE",  path: "/profile"  },
  { label: "> CAPABILITY_MATRIX",  path: "/profile"  }, // same page as profile
  { label: "> SERVICE_RECORD",     path: "/service"  },
  { label: "> DATA_ARCHIVES",      path: "/projects" },
  { label: "> OPEN_CHANNEL",       path: "/contact"  },
];

// Deduplicate by path — show unique pages in nav
const UNIQUE_NAV = [
  { label: "> INITIALIZE",         path: "/"         },
  { label: "> OPERATIVE_PROFILE",  path: "/profile"  },
  { label: "> SERVICE_RECORD",     path: "/service"  },
  { label: "> DATA_ARCHIVES",      path: "/projects" },
  { label: "> OPEN_CHANNEL",       path: "/contact"  },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      fontFamily: "'JetBrains Mono', monospace",
      background: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.75)",
      borderBottom: "1px solid rgba(0,229,255,0.15)",
      boxShadow: scrolled ? "0 0 24px rgba(0,229,255,0.08)" : "none",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#ff2d78", textShadow: "0 0 8px #ff2d78, 0 0 20px #ff2d7844", letterSpacing: "0.06em" }}
          >
            BARKI_M
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ gap: "0.25rem", alignItems: "center" }}>
            {UNIQUE_NAV.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path + item.label}
                  onClick={() => navigate(item.path)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.04em",
                    color: isActive ? "#00e5ff" : "#4a4a6a",
                    textShadow: isActive ? "0 0 8px #00e5ff" : "none",
                    padding: "0.45rem 0.65rem",
                    borderBottom: isActive ? "1px solid #00e5ff" : "1px solid transparent",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#c8c8e0"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#4a4a6a"; }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "1px solid #4a4a6a", cursor: "pointer", color: "#c8c8e0", padding: "0.3rem 0.6rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem" }}
          >
            {menuOpen ? "[ X ]" : "[ ≡ ]"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="flex md:hidden" style={{ flexDirection: "column", padding: "0.4rem 0 0.8rem", borderTop: "1px solid rgba(0,229,255,0.1)" }}>
            {UNIQUE_NAV.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.73rem", color: isActive ? "#00e5ff" : "#c8c8e0", textShadow: isActive ? "0 0 8px #00e5ff" : "none", padding: "0.65rem 0", textAlign: "left" }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
