# Portfolio Website Plan
### Muhammad Maaz Barki
**LinkedIn:** [muhammad-maaz-barki](https://www.linkedin.com/in/muhammad-maaz-barki/) · **Email:** maazbarki@gmail.com

---

## Site Architecture Overview

```
/           → System Boot / Hero (Who I Am)
/experience → Service Records (Teaching + Volunteering)
/projects   → Data Archives (Simulacra + Chiron)
/contact    → Secure Channel (Contact)
```

---

## Phase 1 — Visual Identity & Atmosphere

The site uses a **Diegetic Interface** design language — every UI element exists as if it is part of an in-universe terminal or megacorp database. The visitor does not browse a portfolio; they authenticate into a system.

### Color Palette

| Role | Value | Usage |
|---|---|---|
| Background | `#000000` / `#0a0a0a` | Page and section backgrounds — absolute dark |
| Primary Accent | `#ff2d78` Cyberpunk Pink | CTAs, active states, hover glows |
| Secondary Accent | `#00ff9f` Toxic Green | Data readouts, success states, skill badges |
| Tertiary Accent | `#00e5ff` Electric Cyan | Links, terminal cursor, border highlights |
| Muted Text | `#4a4a6a` | Metadata, timestamps, secondary labels |
| Body Text | `#c8c8e0` | Readable prose on dark backgrounds |

All accents should be used with `box-shadow` / `text-shadow` glow effects:
```css
/* Example glow — apply to accent text and borders */
text-shadow: 0 0 8px #ff2d78, 0 0 20px #ff2d7844;
```

### Typography

- **Terminal / Body:** `JetBrains Mono` or `Fira Code` (Google Fonts) — mandatory for all body copy, data readouts, and UI labels
- **Display / Headings:** `Share Tech Mono` for large section headings; or a blocky aggressive sans-serif such as `Rajdhani` or `Orbitron` for major titles only
- **Rule:** Never use a proportional serif font anywhere on the site

### Motifs & Textures

All of the following should be implemented as lightweight CSS — no heavy video backgrounds:

- **CRT Scanlines:** Repeating horizontal lines overlay at ~3% opacity using a `linear-gradient` pseudo-element on `body`
- **Chromatic Aberration:** On headings and key UI text, apply a subtle color-channel split using `text-shadow` with offset pink and cyan shadows (1–2px offset max — keep it readable)
- **Glowing Drop Shadows:** All bordered elements (cards, buttons, inputs) get a low-spread colored `box-shadow` matching their accent
- **Glitch Animation:** Triggered on hover states — use `@keyframes` with `clip-path` slices that stagger offset and color. Applied to project card titles and nav items. Not auto-playing — only on interaction
- **Grid Background:** A responsive moving geometric grid (perspective grid lines receding to a horizon point) built in raw CSS or a lightweight HTML5 Canvas element — simulates entering cyberspace. Used on the hero/boot section

---

## Phase 2 — Information Architecture (The Lore Map)

Every standard portfolio section is translated into in-universe cyberpunk terminology. This mapping must stay consistent across all copy, labels, and navigation.

| Standard Section | In-Universe Framing | Navigation Label |
|---|---|---|
| Landing / Hero | System Boot / Authentication | `> INITIALIZE` |
| About Me | Operative Profile / Biometrics | `> OPERATIVE_PROFILE.exe` |
| Experience | Service Records / Faction History | `> SERVICE_RECORD` |
| Projects | Data Archives / Neural Constructs | `> DATA_ARCHIVES` |
| Contact | Secure Channel / Comm-Link | `> OPEN_CHANNEL` |

### Boot Sequence (Hero Section)
The page opens with a terminal boot animation — text types character-by-character as if the system is initializing. Example sequence:
```
> SYSTEM BOOT...............................................[ OK ]
> LOADING OPERATIVE PROFILE: BARKI_M........................[ OK ]
> CLEARANCE LEVEL: DEAN'S LIST..............................[ OK ]
> WARNING: UNAUTHORIZED ACCESS DETECTED
> ESTABLISHING SECURE CONNECTION............................[ OK ]
> WELCOME, OPERATIVE.
```
After the sequence completes, the hero content resolves: name, title, bio, and CTAs.

### Navigation Style
Nav items render as terminal commands with a blinking cursor. Active state shows the `>` prompt prefix in the primary accent color.

---

## Section 1 — Operative Profile (About / Who I Am)

**In-universe label:** `OPERATIVE_PROFILE.exe` / `BIOMETRIC DOSSIER`

**Framing:** Presented as a leaked dossier or mercenary profile file — data readouts alongside prose.

**Suggested Copy (draft — refine in your own voice):**
> SUBJECT: BARKI, MUHAMMAD MAAZ
> CLASSIFICATION: Computer Science · LUMS Class of '26
> THREAT ASSESSMENT: Builder of multi-agent AI systems. Background rooted in the humanities — approaches engineering with equal weight on the "why" and the human impact as on the "how." Has led technical instruction for 300+ students, shipped production-grade AI pipelines, and navigated the intersection of government, academia, and industry at the national level.

**Elements to include:**
- Name + title rendered as a terminal data readout
- Bio paragraph (above) in monospace, with a blinking cursor at the end
- `CLEARANCE_LEVEL: DEAN'S HONOR LIST` as a labeled data field — surfaces the award naturally in theme
- Degree field: `AFFILIATION: LUMS · BSc Computer Science · 2022–2026`
- CTA buttons styled as terminal commands: `[ RUN DATA_ARCHIVES.exe ]` and `[ OPEN_CHANNEL.exe ]`
- Social links as terminal-style icon buttons

---

## Section 2 — Service Records (Experience)

**In-universe label:** `SERVICE_RECORD` / `FACTION HISTORY`

**Framing:** Each role is a "faction affiliation" or "corporate contract" on a timeline log.

---

### Record 1 — Head Teaching Assistant · LUMS
**Faction:** Lahore University of Management Sciences
**Total Service:** 10 months · Two consecutive contracts

#### Contract A — Business Data Management (DISC 325)
**Active:** January 2026 – Present
**Clearance:** Head Teaching Assistant

**Site copy:**
- Led academic execution and technical instruction for Business Data Management — bridging theoretical data architectures with hands-on implementation
- Managed a TA team, coordinating grading workflows and standardizing evaluation metrics for complex relational database assignments
- Instructed in advanced relational modeling, schema design, and normalization techniques
- Designed curriculum covering advanced SQL: recursive joins, outer joins, correlated subqueries
- Delivered sessions on NoSQL structures, transactional integrity, and database security
- Guided students in Python and Pandas for ETL pipelines and analytical reporting

**Cyberpunk framing:** *"Instructed operatives in Data Architecture and Query Optimization protocols for enterprise-grade database systems."*

**Skill badges:** SQL · PostgreSQL · NoSQL · Python · Pandas · Database Architecture · Team Leadership

---

#### Contract B — Algorithms (CS-310)
**Active:** August 2025 – December 2025
**Clearance:** Head Teaching Assistant

**Site copy:**
- Directed academic support for the core CS Algorithms course — 300+ graduate and undergraduate students
- Managed and mentored 8 Teaching Assistants, ensuring consistent grading standards across the cohort
- Ran weekly tutorials on Dynamic Programming, Graph Theory, Greedy Algorithms, and Divide & Conquer
- Mentored students in Big-O complexity analysis; directly prepared them for technical interviews and competitive programming
- Streamlined assignment evaluation pipelines, cutting turnaround time without compromising academic integrity

**Cyberpunk framing:** *"Trained operatives in core decryption and processing paradigms — complexity analysis, algorithmic optimization, and adversarial problem-solving."*

**Skill badges:** Algorithms · Dynamic Programming · Graph Theory · Big-O Analysis · Technical Mentorship · 8-person TA Team

---

**Design note:** Display as a single LUMS/faction block with a glowing faction crest or text logo. The two contracts appear as stacked log entries beneath it, each with a timestamp-style date range rendered in `Electric Cyan`. An accordion expand reveals full bullet details.

---

### Record 2 — Volunteer Operative · CeDAR, LUMS
**Event:** "A Leadership Summit on Blockchain and Digital Assets: Technology & Policy"
**Hosts:** CeDAR (Center for Experiential and Design-Based Approaches to Research), LUMS
**Sponsor:** Allied Bank
**Active:** May 2026
**Role:** Primary Interviewer / Volunteer

**Site copy:**
- Acted as a primary interviewer at a premier national summit, facilitating technical and strategic discussions with national policymakers, finance executives, and academic leaders
- Synthesized perspectives from the government–academia–industry triad on blockchain initiatives, regulatory frameworks, and market demand in Pakistan
- Bridged the gap between deep technical blockchain implementation and high-level economic policy discourse
- Demonstrated professional networking and communication skills in a high-profile, multi-sector environment

**Cyberpunk framing:** *"Embedded operative at a national intelligence summit — extracting strategic intelligence from government, academia, and industry factions on blockchain infrastructure and digital asset policy."*

**Certificate:** A PDF download link (certificate of participation) should be attached directly to this card.
- Label it: `[ DOWNLOAD CLEARANCE CERTIFICATE.pdf ]` — styled as a terminal download command
- On click, opens/downloads the PDF
- **Action required:** Upload certificate PDF to the project repo or hosting provider and link it here

**Design note:** Smaller card than the TA entries — visually signals volunteer vs. employment. Style it as a "field operation" or "one-time contract" entry. The PDF download link is a strong credibility anchor; make it visible, not buried.

---

## Section 3 — Data Archives (Projects)

**In-universe label:** `DATA_ARCHIVES` / `NEURAL CONSTRUCTS`

**Framing:** Each project is a secured file or deployed neural subsystem. Cards open like decrypting a locked archive.

**Collaboration note:** Both repos are hosted under collaborator Ehmad Saeed's GitHub account (`justEhmadSaeed`). Each project card should include a clear collaboration credit line: *"Co-built with Ehmad Saeed"* with a link to the repo. Maaz's specific contribution areas are documented below for the site copy.

---

### Construct 001 — SIMULACRA
**Repo:** [github.com/justEhmadSaeed/simulacra](https://github.com/justEhmadSaeed/simulacra)
**Live:** [simulacra.ehmad.dev](https://simulacra.ehmad.dev)
**Classification:** AI-Driven Usability Research Platform
**Tagline:** *"Deploy synthetic operatives to stress-test your product before your users do."*

**Maaz's contribution areas:**
- **Frontend (full ownership):** Built the React/Vite dashboard from scratch — all UI components, layouts, routing, state management, and WebSocket integration for live agent visibility
- **User Persona Implementation (backend):** Defined and built all persona logic — the segment-aware synthetic user profiles (explorer, power user, cautious adopter) that determine how agents reason, interact, and narrate

**Site description:**
> Simulacra deploys synthetic user personas against your product's live URLs — each one narrating what they perceive, where they're confused, and what works. An HCI analysis layer maps those observations to structured friction scores and design-ready findings. Ship with confidence. No scheduling. No recruiting. Repeatable on demand.

**Key highlights:**
- Segment-aware personas modelling different skill levels, patience, and reading habits — Maaz's domain
- Full React/Vite dashboard with live WebSocket agent progress — Maaz's domain
- Multi-agent orchestration with LangGraph-style UX research workflows
- Typed OpenAPI contracts between frontend and backend (Turborepo monorepo)
- Redis pub/sub + Postgres for production data plane

**Cyberpunk framing:** *"A neural simulation rig. Synthetic operatives run reconnaissance on your product and return with intelligence before you go live."*

**Tech badges:** TypeScript · React · Vite · FastAPI · Python · LangGraph · Redis · PostgreSQL · Docker · Turborepo · WebSockets

**Card CTAs:** `[ ACCESS ARCHIVE → GitHub ]` · `[ RUN CONSTRUCT → Live Demo ]`

---

### Construct 002 — CHIRON
**Repo:** [github.com/justEhmadSaeed/chiron](https://github.com/justEhmadSaeed/chiron)
**Live:** [chiron.ehmad.dev](https://chiron.ehmad.dev)
**Classification:** Autonomous Scientific Research Orchestrator
**Tagline:** *"Adversarial agents that stress-test your hypothesis before you waste a lab on it."*

**Maaz's contribution areas:**
- **Agentic Pipeline (backend, full ownership):** Designed and built the complete multi-agent workflow — clearly mapping inputs and outputs at every step, defining agent roles, orchestrating the adversarial literature review sequence, and wiring the continuous-learning RAG feedback loop
- **Frontend–Backend Integration:** Integrated all backend APIs with the React/Vite frontend, ensuring clean data contracts and reliable real-time communication between the agent workers and the UI

**Site description:**
> Chiron validates whether a scientific hypothesis is actually novel before you invest lab time testing it. A team of adversarial agents independently reviews the literature and attacks the hypothesis from different angles. Once novelty is confirmed, Chiron dynamically generates a multi-week experimental protocol using a RAG system that sharpens itself from expert feedback — without retraining.

**Key highlights:**
- Adversarial multi-agent hypothesis validation — Maaz's domain (pipeline design + orchestration)
- Continuous-learning RAG for experimental protocol generation — Maaz's domain
- Full API-to-frontend integration — Maaz's domain
- Firebase Realtime Database for live session persistence
- OpenTelemetry instrumentation for full audit trails
- Decoupled API + Worker architecture, independently scaled via Redis

**Cyberpunk framing:** *"A scientific neural construct. Adversarial sub-routines tear apart your hypothesis in parallel. Survivors get a protocol. The rest get archived."*

**Tech badges:** TypeScript · Python · React · FastAPI · LangChain · RAG · Firebase · Redis · OpenTelemetry · Docker · Turborepo

**Card CTAs:** `[ ACCESS ARCHIVE → GitHub ]` · `[ RUN CONSTRUCT → Live Demo ]`

---

**Design note for both project cards:** Cards render as locked archive files with a classified header. On hover, a glitch animation fires on the project title. Clicking "ACCESS ARCHIVE" animates a decryption sequence (brief CSS glitch) before navigating. The tech badge row renders as small terminal tags in `Toxic Green` on `#111`.

---

## Section 4 — Secure Channel (Contact)

**In-universe label:** `OPEN_CHANNEL.exe` / `COMM-LINK`

**Framing:** A terminal prompt. The contact form is styled as a command-line interface where the user types into labeled fields that look like shell inputs.

**Elements:**
- Terminal intro line: `> ESTABLISHING SECURE CONNECTION... [ OK ]`
- Input fields styled as terminal prompts:
  - `SENDER_ID:__` (name)
  - `RETURN_FREQ:__` (email)
  - `MESSAGE_BODY:__` (multiline)
  - Submit button: `[ TRANSMIT ]`
- Direct links below the form:
  - `> maazbarki@gmail.com`
  - `> linkedin.com/in/muhammad-maaz-barki`
  - `> Lahore / Multan, Pakistan`

---

## Phase 3 — Technical Execution Strategy

All effects must be performant — CSS-first, no heavy libraries, no video backgrounds.

### CSS Glitch Effect
Use `clip-path` with `@keyframes` for text glitch on hover. No JavaScript required:
```css
@keyframes glitch {
  0%   { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 0); }
  20%  { clip-path: inset(70% 0 5% 0);  transform: translate(2px, 0);  }
  40%  { clip-path: inset(40% 0 30% 0); transform: translate(-1px, 0); }
  60%  { clip-path: inset(10% 0 80% 0); transform: translate(1px, 0);  }
  80%  { clip-path: inset(55% 0 15% 0); transform: translate(-2px, 0); }
  100% { clip-path: inset(0% 0 0% 0);   transform: translate(0, 0);    }
}
/* Apply as ::before and ::after pseudo-elements on hover targets */
```
Apply to: project card titles, nav items, section headings on hover. Not auto-playing.

### Terminal Typing Effect
Use **Typed.js** (lightweight, ~12kb) or a simple vanilla JS implementation for character-by-character rendering. Apply to:
- The boot sequence on page load (hero section)
- The contact section intro line
- Optional: section headers as they scroll into view

### CRT Scanlines
Pure CSS pseudo-element on `body`:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  z-index: 9999;
}
```

### Grid Background
HTML5 Canvas element in the hero section — a perspective grid of lines converging to a vanishing point, slowly animating forward (the "entering cyberspace" effect). Alternatively, a pure CSS grid using `perspective` and `transform` on a `::before` element. Canvas is preferable for the animation smoothness.

### Recommended Tech Stack for the Site
- **Framework:** Next.js 14+ (App Router) — fast, SEO-friendly, easy Vercel deploy
- **Styling:** Tailwind CSS + custom CSS for glitch/scanline effects (Tailwind alone cannot handle all the custom animation work)
- **Fonts:** Google Fonts — `JetBrains Mono`, `Orbitron`
- **Typing:** Typed.js or vanilla JS
- **Deploy:** Vercel (consistent with Simulacra and Chiron deployment)
- **PDF hosting:** Store the CeDAR certificate in `/public/certificates/` in the repo — serves as a static asset

---

## Open Items / Action Required

1. **CeDAR certificate PDF** — upload the file; it will be served as a static asset with a terminal-style download link on the card
2. **Profile photo** — needed for the Operative Profile / hero section (will be styled with a high-contrast filter or chromatic aberration effect to fit the aesthetic)
3. **Bio refinement** — the Section 1 draft is a starting point; the voice should be yours
4. **Education entry** — confirm whether to include Dean's List year(s) or just the degree and dates
5. **Additional projects** — flag any coursework, personal, or open-source work to add to the Data Archives
6. **Contact form backend** — confirm how form submissions should be handled (e.g., Resend, Formspree, or email-only with no form)
