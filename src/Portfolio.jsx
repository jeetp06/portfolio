import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * Jeet Pancholi — Portfolio
 * Signature element: a live, interactive flood-fill engine in the hero,
 * referencing the C++ BFS/DFS image flood-fill project. Click to re-seed,
 * toggle traversal mode to watch BFS (concentric wavefront) vs DFS (snaking
 * paths) fill the grid through a forged steel -> copper gradient.
 */

/* ------------------------------------------------------------------ */
/*  Thermal/metal gradient (navy -> electric blue -> steel -> copper)  */
/* ------------------------------------------------------------------ */
const STOPS = [
  [0.0, [14, 26, 54]],
  [0.32, [36, 96, 224]],
  [0.58, [92, 122, 168]],
  [0.8, [208, 108, 48]],
  [1.0, [244, 178, 86]],
];
function plasma(t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i];
    const [b, cb] = STOPS[i + 1];
    if (t >= a && t <= b) {
      const f = (t - a) / (b - a || 1);
      return [
        Math.round(ca[0] + (cb[0] - ca[0]) * f),
        Math.round(ca[1] + (cb[1] - ca[1]) * f),
        Math.round(ca[2] + (cb[2] - ca[2]) * f),
      ];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/* ------------------------------------------------------------------ */
/*  Flood-fill hero canvas                                             */
/* ------------------------------------------------------------------ */
function FloodCanvas({ mode, theme, onSeedChange }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(0);
  const modeRef = useRef(mode);
  const themeRef = useRef(theme);
  modeRef.current = mode;
  themeRef.current = theme;

  const CELL = 15;

  const seedAt = useCallback((cx, cy) => {
    const st = stateRef.current;
    if (!st) return;
    const { cols, rows } = st;
    st.visited.fill(0);
    st.order.fill(-1);
    st.alpha.fill(0);
    st.count = 0;
    st.maxOrder = cols * rows;
    st.frontier = [];
    const sx = Math.max(0, Math.min(cols - 1, cx));
    const sy = Math.max(0, Math.min(rows - 1, cy));
    const idx = sy * cols + sx;
    onSeedChange?.({
      x: sx / Math.max(1, cols - 1),
      y: sy / Math.max(1, rows - 1),
    });
    st.visited[idx] = 1;
    st.order[idx] = 0;
    st.count = 1;
    st.frontier.push(idx);
    st.head = 0;
  }, [onSeedChange]);

  const setup = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    stateRef.current = {
      ctx, w, h, cols, rows,
      visited: new Uint8Array(cols * rows),
      order: new Int32Array(cols * rows).fill(-1),
      alpha: new Float32Array(cols * rows),
      frontier: [],
      head: 0,
      count: 0,
      maxOrder: cols * rows,
    };
    seedAt(Math.floor(cols * 0.16), Math.floor(rows * 0.42));
  }, [seedAt]);

  useEffect(() => {
    setup();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const neighbors = (idx, cols, rows) => {
      const x = idx % cols;
      const y = Math.floor(idx / cols);
      const out = [];
      if (x + 1 < cols) out.push(idx + 1);
      if (y + 1 < rows) out.push(idx + cols);
      if (x - 1 >= 0) out.push(idx - 1);
      if (y - 1 >= 0) out.push(idx - cols);
      return out;
    };

    const step = (perFrame) => {
      const st = stateRef.current;
      if (!st) return;
      const { cols, rows } = st;
      let processed = 0;
      while (processed < perFrame) {
        let cur;
        if (modeRef.current === "DFS") {
          if (st.frontier.length === 0) break;
          cur = st.frontier.pop();
        } else {
          if (st.head >= st.frontier.length) break;
          cur = st.frontier[st.head++];
        }
        const nbs = neighbors(cur, cols, rows);
        if (modeRef.current === "DFS") {
          for (let i = nbs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nbs[i], nbs[j]] = [nbs[j], nbs[i]];
          }
        }
        for (const n of nbs) {
          if (!st.visited[n]) {
            st.visited[n] = 1;
            st.order[n] = st.count++;
            st.frontier.push(n);
          }
        }
        processed++;
      }
    };

    const draw = () => {
      const st = stateRef.current;
      if (!st) return;
      const { ctx, w, h, cols, rows, order, alpha } = st;
      const dark = themeRef.current === "dark";
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.05)" : "rgba(20,22,28,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        const px = x * CELL + 0.5;
        ctx.moveTo(px, 0); ctx.lineTo(px, h);
      }
      for (let y = 0; y <= rows; y++) {
        const py = y * CELL + 0.5;
        ctx.moveTo(0, py); ctx.lineTo(w, py);
      }
      ctx.stroke();
      const base = dark ? 0.74 : 0.88;
      for (let i = 0; i < order.length; i++) {
        if (order[i] < 0) continue;
        if (alpha[i] < 0.999) alpha[i] = Math.min(1, alpha[i] + 0.12);
        const t = order[i] / st.maxOrder;
        const [r, g, b] = plasma(Math.pow(t, 0.75));
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        const falloff = (dark ? 0.45 : 0.62) + (dark ? 0.55 : 0.38) * (x / w);
        ctx.fillStyle = `rgba(${r},${g},${b},${base * alpha[i] * falloff})`;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      }
    };

    if (reduce) {
      const st = stateRef.current;
      const guard = st.cols * st.rows + 5;
      let g = 0;
      while ((st.head < st.frontier.length || st.frontier.length > 0) && g < guard) {
        step(st.cols * st.rows);
        g++;
        if (st.count >= st.cols * st.rows) break;
      }
      st.alpha.fill(1);
      draw();
      // still redraw on theme change
      const id = setInterval(draw, 400);
      return () => clearInterval(id);
    }

    const loop = () => {
      step(36);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => { setup(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [setup]);

  const handleClick = (e) => {
    const st = stateRef.current;
    const canvas = canvasRef.current;
    if (!st || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = Math.floor((e.clientX - rect.left) / CELL);
    const cy = Math.floor((e.clientY - rect.top) / CELL);
    seedAt(cx, cy);
  };

  return (
    <div className="floodWrap" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className="floodCanvas"
        onClick={handleClick}
        aria-hidden="true"
      />
      <div className="floodVeil" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll reveal hook                                                 */
/* ------------------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll("[data-reveal]");
    if (reduce) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      },
      { threshold: 0.16 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const Eyebrow = ({ children }) => (
  <span className="eyebrow"><i className="cell" />{children}</span>
);

const VolatilityMiniChart = () => {
  const points = [
    [8, 66], [15, 58], [22, 61], [29, 50], [36, 54], [43, 46],
    [50, 41], [57, 35], [64, 38], [71, 28], [78, 31], [86, 22],
  ];

  return (
    <div className="miniChart" aria-label="Animated prediction chart for options volatility">
      <div className="miniAxis x" />
      <div className="miniAxis y" />
      <div className="fitLine" />
      {points.map(([left, top], i) => (
        <span
          className="dataDot"
          key={`${left}-${top}`}
          style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
      <div className="featureBars" aria-hidden="true">
        <span style={{ height: "38%" }} />
        <span style={{ height: "62%" }} />
        <span style={{ height: "48%" }} />
        <span style={{ height: "76%" }} />
      </div>
      <span className="chartLabel">IV prediction surface</span>
    </div>
  );
};

const FloodFillMiniChart = () => (
  <div className="miniChart floodMini" aria-label="Animated grid traversal preview">
    {Array.from({ length: 48 }).map((_, i) => (
      <span className="gridCell" key={i} style={{ animationDelay: `${i * 34}ms` }} />
    ))}
    <span className="pathTrace" />
    <span className="chartLabel">BFS / DFS traversal</span>
  </div>
);

const PantryMiniChart = () => (
  <div className="miniChart pantryMini" aria-label="Animated pantry recommendation flow">
    <div className="scanFrame">
      <span />
      <span />
      <span />
    </div>
    <div className="recipeNodes">
      <i />
      <i />
      <i />
    </div>
    <span className="scanLine" />
    <span className="chartLabel">OCR to recipe match</span>
  </div>
);

const ProjectVisual = ({ title }) => {
  if (title === "Apple Options Volatility Prediction") return <VolatilityMiniChart />;
  if (title === "Asynchronous Image Flood-Fill Engine") return <FloodFillMiniChart />;
  if (title === "CookingPal — Pantry & Recipes") return <PantryMiniChart />;
  return null;
};

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
const RESUME_URL = "resume-JeetPancholi.pdf"; // place this file in /public

const LINKS = {
  email: "mailto:jeetspancholi@gmail.com",
  linkedin: "https://www.linkedin.com/in/jeet-pancholi",
  github: "https://github.com/jeetp06",
};

const EXPERIENCE = [
  {
    org: "Kripa Montessori School",
    role: "Full Stack Developer Intern",
    place: "Schaumburg, IL",
    when: "May 2025 — Aug 2025",
    points: [
      "Tech lead on a React + Tailwind proof-of-concept that modernized the school's digital experience for staff and families.",
      "Ran the full Git workflow — clean version control, project structure, and docs that cut handoff friction by an estimated 20–25%.",
      "Digitized legacy paper records and built a metadata tagging system, making the archive searchable for the first time and cutting lookup time 50–60%.",
    ],
  },
  {
    org: "University of Illinois Chicago",
    role: "MCS 160 Teaching Aide I",
    place: "Chicago, IL",
    when: "Feb 2025 — May 2025",
    points: [
      "Streamlined grading for 30+ students with a standardized feedback rubric for Python assignments.",
      "Reviewed student code for correctness, efficiency, and style, reinforcing core course concepts.",
    ],
  },
  {
    org: "Driving Forward Program",
    role: "AI Consulting Intern",
    place: "Chicago, IL",
    when: "Jan 2025 — Mar 2025",
    points: [
      "Assessed operational inefficiencies in primary-care workflows that ate into direct patient time.",
      "Designed and deployed an unbiased survey of randomly selected physicians on documentation burden and automation opportunities.",
      "Proposed an AI scribe projected to cut administrative overhead 15–20% and return that time to patient care.",
    ],
  },
];

const WORK = [
  {
    tag: "C++ · BFS / DFS",
    title: "Asynchronous Image Flood-Fill Engine",
    when: "Fall 2025",
    metric: "−25–35% peak memory",
    body:
      "Built a C++ flood-fill engine for high-res PNG traversal using custom BFS/DFS iterators. Localized stacks and queues reduced peak memory while generating 100+ frame traversal GIFs.",
  },
  {
    tag: "Python · scikit-learn",
    title: "Apple Options Volatility Prediction",
    when: "Illinois Data Science Club · 2025",
    metric: "R² = 0.97",
    body:
      "Modeled 2,000+ Apple option contracts across IV, DTE, strike, volume, and sentiment features. A Random Forest captured the non-linear pricing structure and reached R² 0.97.",
  },
  {
    tag: "React Native · Firebase",
    title: "CookingPal — Pantry & Recipes",
    when: "Summer 2025",
    metric: "Vision-based entry",
    body:
      "Built a React Native pantry app with manual and OCR-based grocery entry. Firebase handled storage while recipe APIs turned inventory data into personalized meal recommendations.",
  },
];

const SKILLS = [
  {
    label: "Languages & Frameworks",
    items: ["Python", "JavaScript", "C", "C++", "React", "React Native", "Flask", "JavaFX", "HTML", "CSS", "Tailwind"],
  },
  {
    label: "Libraries & Technologies",
    items: ["NumPy", "Pandas", "Matplotlib", "REST APIs", "Firebase", "SQLite"],
  },
  {
    label: "Tools & Platforms",
    items: ["Git", "GitHub", "VS Code", "Docker", "Linux / Unix", "Jupyter", "Expo Go"],
  },
];

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */
const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("jeet-portfolio-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function Portfolio() {
  const [mode, setMode] = useState("BFS");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [seed, setSeed] = useState({ x: 0.16, y: 0.42 });
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  useReveal();

  useEffect(() => {
    window.localStorage.setItem("jeet-portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const updateContact = (field) => (e) => setContactForm((form) => ({ ...form, [field]: e.target.value }));
  const sendEmail = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${contactForm.name || "your website"}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`
    );
    window.location.href = `mailto:jeetspancholi@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="root" data-theme={theme}>
      <style>{CSS}</style>

      {/* NAV */}
      <header className={`nav ${scrolled ? "navOn" : ""} ${menuOpen ? "navOpen" : ""}`}>
        <a href="#top" className="navName">Jeet&nbsp;Pancholi</a>
        <button
          className="menuBtn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <nav className="navLinks" id="site-navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href={RESUME_URL} download onClick={() => setMenuOpen(false)}>Resume</a>
        </nav>
        <button className="themeBtn" onClick={toggleTheme} aria-label="Toggle color theme">
          <span className="themeGlyph">{theme === "dark" ? "☀" : "☾"}</span>
          <span className="themeWord">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <FloodCanvas mode={mode} theme={theme} onSeedChange={setSeed} />
        <div className="heroInner">
          <Eyebrow>math + computer science · uiuc</Eyebrow>
          <h1 className="heroTitle">Jeet<br />Pancholi</h1>
          <p className="heroLede">
            I build systems that <em>traverse, organize, and predict</em> — from a
            BFS flood-fill engine in C++ to volatility models that hit R²&nbsp;0.97.
            Mathematics &amp; CS undergrad, graduating December&nbsp;2027.
          </p>
          <div className="heroControls">
            <span className="ctrlLabel">flood fill — click the grid to re-seed</span>
            <div className="toggle" role="group" aria-label="traversal mode">
              <button className={mode === "BFS" ? "on" : ""} onClick={() => setMode("BFS")} aria-pressed={mode === "BFS"}>BFS</button>
              <button className={mode === "DFS" ? "on" : ""} onClick={() => setMode("DFS")} aria-pressed={mode === "DFS"}>DFS</button>
            </div>
          </div>
        </div>
        <div className="heroCoord">x:{seed.x.toFixed(2)} y:{seed.y.toFixed(2)} — seed</div>
      </section>

      {/* STATS */}
      <section className="stats" data-reveal>
        <div className="stat"><span className="statNum">3.74</span><span className="statLab">GPA / 4.0</span></div>
        <div className="stat"><span className="statNum">Dec 2027</span><span className="statLab">expected B.S.</span></div>
        <div className="stat"><span className="statNum">Math + CS</span><span className="statLab">UIUC</span></div>
        <div className="stat"><span className="statNum">US Citizen</span><span className="statLab">work authorized</span></div>
      </section>

      {/* WORK */}
      <section className="section" id="work">
        <div className="sectionHead" data-reveal>
          <Eyebrow>selected work</Eyebrow>
          <h2>Things I&apos;ve built, end to end.</h2>
        </div>
        <div className="workGrid">
          {WORK.map((w, i) => (
            <article className="card" data-reveal style={{ transitionDelay: `${i * 70}ms` }} key={w.title}>
              <div className="cardTop">
                <span className="cardTag">{w.tag}</span>
                <span className="cardMetric">{w.metric}</span>
              </div>
              <h3>{w.title}</h3>
              <p className="cardWhen">{w.when}</p>
              <ProjectVisual title={w.title} />
              <p className="cardBody">{w.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="section sectionAlt" id="experience">
        <div className="sectionHead" data-reveal>
          <Eyebrow>experience</Eyebrow>
          <h2>Where I&apos;ve done the work.</h2>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((e, i) => (
            <div className="tItem" data-reveal style={{ transitionDelay: `${i * 60}ms` }} key={e.org}>
              <div className="tNode"><i /></div>
              <div className="tCard">
                <div className="tHead">
                  <h3>{e.role}</h3>
                  <span className="tWhen">{e.when}</span>
                </div>
                <p className="tOrg">{e.org} <span>· {e.place}</span></p>
                <ul>{e.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="sectionHead" data-reveal>
          <Eyebrow>toolkit</Eyebrow>
          <h2>Languages, libraries, and the things around them.</h2>
        </div>
        <div className="skillCols">
          {SKILLS.map((g, i) => (
            <div className="skillCol" data-reveal style={{ transitionDelay: `${i * 70}ms` }} key={g.label}>
              <p className="skillLabel">{g.label}</p>
              <div className="chips">{g.items.map((it) => <span className="chip" key={it}>{it}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div data-reveal>
          <Eyebrow>contact</Eyebrow>
          <h2 className="contactBig">Let&apos;s build something.</h2>
          <p className="contactSub">Open to internships and new-grad roles in software, ML, and data.</p>
          <form className="contactForm" onSubmit={sendEmail}>
            <div className="formGrid">
              <label>
                <span>Name</span>
                <input type="text" value={contactForm.name} onChange={updateContact("name")} placeholder="Your name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={contactForm.email} onChange={updateContact("email")} placeholder="you@example.com" required />
              </label>
            </div>
            <label>
              <span>Message</span>
              <textarea value={contactForm.message} onChange={updateContact("message")} placeholder="Tell me what you want to build..." rows="6" required />
            </label>
            <button className="btn primary" type="submit">Send Email</button>
          </form>
          <div className="contactRow">
            <a className="btn" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a className="btn" href={RESUME_URL} download>Download résumé ↓</a>
          </div>
        </div>
      </section>

      <footer className="foot">
        <span>© {new Date().getFullYear()} Jeet Pancholi</span>
        <span className="footMono">built with react · seeded with BFS</span>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.root{
  --accent:#2F62E0; --accent-deep:#1E3A8A; --copper:#C9711F;
  font-family:'Inter',system-ui,sans-serif; line-height:1.55;
  -webkit-font-smoothing:antialiased; overflow-x:hidden;
  background:var(--paper); color:var(--ink);
  transition:background .4s ease,color .4s ease;
}
.root[data-theme="light"]{
  --paper:#F1F3F6; --paper2:#E7EBF0; --card:#FFFFFF;
  --ink:#14161C; --ink2:#3B404C; --ink3:#697084; --line:#DCE0E7;
}
.root[data-theme="dark"]{
  --accent:#5187F5; --accent-deep:#2C4FAE; --copper:#E08433;
  --paper:#0E1117; --paper2:#141a23; --card:#171d27;
  --ink:#E8EBF1; --ink2:#AAB2BF; --ink3:#7A8392; --line:#262d39;
}
.root *{box-sizing:border-box;}
.root a{color:inherit;text-decoration:none;}
.eyebrow{
  font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--ink3); display:inline-flex; align-items:center; gap:9px;
}
.eyebrow .cell{width:9px;height:9px;display:inline-block;border-radius:1px;background:linear-gradient(135deg,var(--accent),var(--copper));}

/* NAV */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;gap:20px;
  justify-content:space-between;padding:16px clamp(20px,5vw,64px);
  transition:background .35s ease,backdrop-filter .35s ease,box-shadow .35s ease;
}
.navOn{background:color-mix(in srgb,var(--paper) 82%,transparent);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--line);}
.navName{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:16px;letter-spacing:-.01em;color:var(--ink);}
.navLinks{display:flex;gap:24px;font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:700;color:var(--ink);margin-left:auto;margin-right:6px;}
.navLinks a{position:relative;padding:4px 0;}
.navLinks a::after{content:"";position:absolute;left:0;bottom:0;height:1.5px;width:0;background:var(--accent);transition:width .25s ease;}
.navLinks a:hover{color:var(--ink);}
.navLinks a:hover::after{width:100%;}
.menuBtn{display:none;}
.themeBtn{
  display:inline-flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:12px;
  font-weight:700;letter-spacing:.05em;color:var(--ink);background:var(--card);border:1px solid var(--line);
  border-radius:999px;padding:7px 13px;cursor:pointer;transition:.22s;
}
.themeBtn:hover{border-color:var(--accent);color:var(--accent);}
.themeGlyph{font-size:13px;line-height:1;}

/* HERO */
.hero{position:relative;min-height:92vh;display:flex;align-items:center;overflow:hidden;}
.floodWrap{position:absolute;inset:0;z-index:0;}
.floodCanvas{display:block;width:100%;height:100%;cursor:crosshair;}
.floodVeil{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(100deg,var(--paper) 8%,color-mix(in srgb,var(--paper) 62%,transparent) 34%,transparent 64%);}
.root[data-theme="light"] .floodVeil{
  background:linear-gradient(100deg,var(--paper) 4%,color-mix(in srgb,var(--paper) 42%,transparent) 28%,transparent 58%);
}
.heroInner{position:relative;z-index:2;padding:0 clamp(20px,5vw,64px);max-width:840px;pointer-events:none;}
.heroInner .toggle,.heroInner .ctrlLabel{pointer-events:auto;}
.heroTitle{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(58px,11vw,138px);line-height:.9;letter-spacing:-.035em;margin:18px 0 22px;}
.heroLede{font-size:clamp(16px,2.1vw,20px);max-width:30em;color:var(--ink2);}
.heroLede em{font-style:normal;color:var(--ink);font-weight:600;background:linear-gradient(transparent 62%,color-mix(in srgb,var(--accent) 28%,transparent) 62%);}
.heroControls{margin-top:30px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.ctrlLabel{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.05em;color:var(--ink3);}
.toggle{display:inline-flex;border:1px solid var(--line);border-radius:999px;background:color-mix(in srgb,var(--card) 70%,transparent);backdrop-filter:blur(6px);overflow:hidden;}
.toggle button{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.08em;border:0;background:transparent;color:var(--ink2);padding:8px 16px;cursor:pointer;transition:.2s;}
.toggle button.on{background:linear-gradient(135deg,var(--accent),var(--accent-deep));color:#fff;}
.toggle button:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
.heroCoord{position:absolute;right:clamp(20px,5vw,64px);bottom:26px;z-index:2;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ink3);letter-spacing:.06em;}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
.stat{padding:34px clamp(16px,3vw,40px);display:flex;flex-direction:column;gap:6px;border-right:1px solid var(--line);}
.stat:last-child{border-right:0;}
.statNum{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:clamp(22px,3vw,32px);letter-spacing:-.02em;}
.statLab{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);}

/* SECTIONS */
.section{padding:clamp(64px,9vw,128px) clamp(20px,5vw,64px);max-width:1180px;margin:0 auto;}
.sectionAlt{background:var(--paper2);max-width:none;}
.sectionAlt > *{max-width:1180px;margin-left:auto;margin-right:auto;}
.sectionHead{margin-bottom:54px;}
.sectionHead h2{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:clamp(28px,4.4vw,52px);letter-spacing:-.025em;line-height:1.04;margin:16px 0 0;max-width:18ch;}

/* WORK CARDS */
.workGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:26px 24px 28px;display:flex;flex-direction:column;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease;}
.card:hover{transform:translateY(-6px);box-shadow:0 18px 40px -22px rgba(0,0,0,.45);border-color:var(--accent);}
.cardTop{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:18px;}
.cardTag{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.06em;color:var(--ink3);}
.cardMetric{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:#fff;background:linear-gradient(135deg,var(--accent),var(--accent-deep));padding:4px 9px;border-radius:6px;white-space:nowrap;}
.card h3{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:21px;letter-spacing:-.02em;margin:0 0 4px;line-height:1.12;}
.cardWhen{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--ink3);margin:0 0 14px;}
.cardBody{font-size:14.5px;line-height:1.62;color:var(--ink2);margin:0;}
.miniChart{position:relative;height:132px;margin:4px 0 18px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 10%,var(--card)),var(--card));}
.miniChart::before{content:"";position:absolute;inset:0;background-image:linear-gradient(to right,color-mix(in srgb,var(--line) 72%,transparent) 1px,transparent 1px),linear-gradient(to bottom,color-mix(in srgb,var(--line) 72%,transparent) 1px,transparent 1px);background-size:22px 22px;opacity:.65;}
.miniAxis{position:absolute;background:var(--ink3);opacity:.5;}
.miniAxis.x{left:16px;right:12px;bottom:22px;height:1px;}
.miniAxis.y{left:16px;top:12px;bottom:22px;width:1px;}
.fitLine{position:absolute;left:18px;right:18px;top:62px;height:3px;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--copper));transform:rotate(-23deg);transform-origin:center;opacity:.9;animation:fitPulse 2.8s ease-in-out infinite;}
.dataDot{position:absolute;width:8px;height:8px;border-radius:999px;background:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent);transform:translate(-50%,-50%);animation:dotLearn 2.4s ease-in-out infinite;}
.featureBars{position:absolute;right:14px;bottom:30px;display:flex;align-items:flex-end;gap:5px;height:42px;}
.featureBars span{display:block;width:7px;border-radius:999px;background:linear-gradient(180deg,var(--copper),var(--accent));opacity:.7;animation:barSignal 2.1s ease-in-out infinite;}
.featureBars span:nth-child(2){animation-delay:.16s;}
.featureBars span:nth-child(3){animation-delay:.32s;}
.featureBars span:nth-child(4){animation-delay:.48s;}
.chartLabel{position:absolute;left:24px;bottom:10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.06em;color:var(--ink3);padding:7px 10px;border-radius:999px;line-height:1;z-index:3;background:color-mix(in srgb,var(--card) 88%,transparent);backdrop-filter:blur(8px);}
.floodMini{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);gap:5px;padding:18px 18px 34px;}
.floodMini::before{display:none;}
.gridCell{border-radius:4px;background:color-mix(in srgb,var(--line) 72%,transparent);animation:gridFill 2.8s ease-in-out infinite;}
.pathTrace{position:absolute;left:22px;right:28px;top:64px;height:3px;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--copper));opacity:.9;clip-path:polygon(0 35%,18% 35%,18% 0,34% 0,34% 68%,54% 68%,54% 28%,74% 28%,74% 100%,100% 100%,100% 0,0 0);animation:fitPulse 2.6s ease-in-out infinite;}
.pantryMini{display:flex;align-items:center;justify-content:space-between;padding:22px 24px 38px;}
.pantryMini::before{opacity:.42;}
.scanFrame{position:relative;width:42%;height:72px;border:1px solid color-mix(in srgb,var(--accent) 46%,var(--line));border-radius:10px;background:color-mix(in srgb,var(--accent) 8%,transparent);overflow:hidden;}
.scanFrame span{position:absolute;left:12px;right:12px;height:7px;border-radius:999px;background:var(--ink3);opacity:.5;}
.scanFrame span:nth-child(1){top:18px;width:56%;}
.scanFrame span:nth-child(2){top:34px;width:72%;}
.scanFrame span:nth-child(3){top:50px;width:44%;}
.scanLine{position:absolute;left:24px;width:calc(42% - 2px);top:26px;height:2px;border-radius:999px;background:var(--copper);box-shadow:0 0 16px color-mix(in srgb,var(--copper) 72%,transparent);animation:scanMove 2.4s ease-in-out infinite;}
.recipeNodes{position:relative;width:42%;height:72px;}
.recipeNodes::before,.recipeNodes::after{content:"";position:absolute;left:22%;right:22%;height:1px;background:color-mix(in srgb,var(--accent) 55%,transparent);}
.recipeNodes::before{top:28px;transform:rotate(18deg);}
.recipeNodes::after{top:44px;transform:rotate(-18deg);}
.recipeNodes i{position:absolute;width:28px;height:28px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--copper));box-shadow:0 8px 22px -14px rgba(0,0,0,.55);animation:dotLearn 2.5s ease-in-out infinite;}
.recipeNodes i:nth-child(1){left:0;top:22px;}
.recipeNodes i:nth-child(2){right:0;top:4px;animation-delay:.2s;}
.recipeNodes i:nth-child(3){right:4px;bottom:0;animation-delay:.4s;}
@keyframes gridFill{0%,18%{background:color-mix(in srgb,var(--line) 72%,transparent);transform:scale(.96);}48%,100%{background:linear-gradient(135deg,var(--accent),var(--copper));transform:scale(1);}}
@keyframes scanMove{0%,100%{transform:translateY(0);opacity:.55;}50%{transform:translateY(52px);opacity:1;}}
@keyframes dotLearn{0%,100%{transform:translate(-50%,-50%) scale(.9);opacity:.72;}50%{transform:translate(-50%,-50%) scale(1.22);opacity:1;}}
@keyframes fitPulse{0%,100%{filter:saturate(1);opacity:.75;}50%{filter:saturate(1.4);opacity:1;}}
@keyframes barSignal{0%,100%{transform:scaleY(.76);opacity:.48;}50%{transform:scaleY(1);opacity:.9;}}

/* TIMELINE */
.timeline{position:relative;padding-left:28px;}
.timeline::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:1.5px;background:var(--line);}
.tItem{position:relative;margin-bottom:26px;}
.tNode{position:absolute;left:-28px;top:6px;}
.tNode i{display:block;width:11px;height:11px;border-radius:2px;background:linear-gradient(135deg,var(--accent),var(--copper));box-shadow:0 0 0 4px var(--paper2);}
.tCard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 24px;}
.tHead{display:flex;justify-content:space-between;align-items:baseline;gap:14px;flex-wrap:wrap;}
.tCard h3{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:19px;letter-spacing:-.02em;margin:0;}
.tWhen{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--ink3);white-space:nowrap;}
.tOrg{font-size:14px;color:var(--ink2);font-weight:500;margin:4px 0 12px;}
.tOrg span{color:var(--ink3);font-weight:400;}
.tCard ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:7px;}
.tCard li{font-size:14px;color:var(--ink2);}
.tCard li::marker{color:var(--accent);}

/* SKILLS */
.skillCols{display:grid;grid-template-columns:repeat(3,1fr);gap:34px;}
.skillLabel{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);margin:0 0 16px;}
.chips{display:flex;flex-wrap:wrap;gap:8px;}
.chip{font-size:13.5px;padding:7px 13px;border:1px solid var(--line);border-radius:999px;background:var(--card);transition:.22s;cursor:default;}
.chip:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px);}

/* CONTACT */
.contact{text-align:left;}
.contactBig{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(40px,8vw,92px);letter-spacing:-.035em;line-height:.95;margin:16px 0 0;}
.contactSub{font-size:17px;color:var(--ink2);margin:18px 0 30px;}
.contactForm{max-width:760px;display:flex;flex-direction:column;gap:14px;margin-bottom:22px;}
.formGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.contactForm label{display:flex;flex-direction:column;gap:7px;}
.contactForm label span{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);}
.contactForm input,.contactForm textarea{width:100%;font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:10px;padding:13px 14px;outline:none;transition:border-color .2s ease,box-shadow .2s ease,background .2s ease;}
.contactForm textarea{resize:vertical;min-height:150px;}
.contactForm input::placeholder,.contactForm textarea::placeholder{color:var(--ink3);}
.contactForm input:focus,.contactForm textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent);}
.contactForm .btn{align-self:flex-start;cursor:pointer;background:var(--ink);}
.contactRow{display:flex;flex-wrap:wrap;gap:12px;}
.btn{font-family:'JetBrains Mono',monospace;font-size:13px;padding:13px 20px;border-radius:10px;border:1px solid var(--ink);transition:.22s;}
.btn:hover{transform:translateY(-2px);}
.btn.primary{background:var(--ink);color:var(--paper);}
.btn.primary:hover{background:var(--accent);border-color:var(--accent);color:#fff;}
.btn:not(.primary):not(.ghost):hover{background:var(--ink);color:var(--paper);}
.btn.ghost{border-color:var(--line);color:var(--ink2);}
.btn.ghost:hover{border-color:var(--accent);color:var(--accent);}

/* FOOTER */
.foot{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding:28px clamp(20px,5vw,64px);border-top:1px solid var(--line);font-size:13px;color:var(--ink3);}
.footMono{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.06em;}

/* REVEAL */
[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;}
[data-reveal].in{opacity:1;transform:none;}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px;}

@media(max-width:880px){
  .nav{flex-wrap:wrap;gap:12px 14px;padding:13px 18px;background:color-mix(in srgb,var(--paper) 88%,transparent);backdrop-filter:blur(10px);box-shadow:0 1px 0 var(--line);}
  .navName{font-size:15px;}
  .menuBtn{display:inline-flex;flex-direction:column;justify-content:center;gap:4px;width:38px;height:38px;margin-left:auto;border:1px solid var(--line);border-radius:10px;background:var(--card);cursor:pointer;padding:0 10px;}
  .menuBtn span{display:block;width:100%;height:2px;border-radius:999px;background:var(--ink);transition:transform .2s ease,opacity .2s ease;}
  .navOpen .menuBtn span:nth-child(1){transform:translateY(6px) rotate(45deg);}
  .navOpen .menuBtn span:nth-child(2){opacity:0;}
  .navOpen .menuBtn span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}
  .navLinks{order:4;width:100%;margin:0;display:none;grid-template-columns:1fr;gap:2px;padding:8px;border:1px solid var(--line);border-radius:12px;background:var(--card);box-shadow:0 18px 38px -28px rgba(0,0,0,.35);}
  .navOpen .navLinks{display:grid;}
  .navLinks a{font-size:12px;padding:11px 12px;border-radius:8px;}
  .navLinks a:hover{background:color-mix(in srgb,var(--accent) 12%,transparent);}
  .navLinks a::after{display:none;}
  .themeBtn{padding:6px 10px;font-size:11px;}
  .hero{min-height:100svh;align-items:flex-start;padding-top:130px;}
  .heroInner{padding:0 18px;max-width:100%;}
  .heroTitle{font-size:clamp(54px,18vw,78px);margin:14px 0 18px;}
  .heroLede{font-size:16px;max-width:100%;}
  .heroControls{align-items:flex-start;gap:12px;margin-top:24px;}
  .ctrlLabel{width:100%;font-size:10.5px;}
  .floodVeil{background:linear-gradient(180deg,var(--paper) 0%,color-mix(in srgb,var(--paper) 78%,transparent) 42%,transparent 100%);}
  .root[data-theme="light"] .floodVeil{background:linear-gradient(180deg,var(--paper) 0%,color-mix(in srgb,var(--paper) 52%,transparent) 38%,transparent 86%);}
  .heroCoord{display:none;}
  .workGrid{grid-template-columns:1fr;}
  .skillCols{grid-template-columns:1fr;gap:28px;}
  .stats{grid-template-columns:repeat(2,1fr);}
  .stat:nth-child(2){border-right:0;}
  .stat:nth-child(1),.stat:nth-child(2){border-bottom:1px solid var(--line);}
  .section{padding:64px 18px;}
  .card,.tCard{padding:22px 18px;}
  .formGrid{grid-template-columns:1fr;}
  .contactForm .btn{width:100%;align-self:stretch;text-align:center;}
  .contactRow{flex-direction:column;}
  .btn{width:100%;text-align:center;}
}
@media(max-width:480px){
  .nav{padding-inline:14px;}
  .themeWord{display:none;}
  .stats{grid-template-columns:1fr;}
  .stat{border-right:0;border-bottom:1px solid var(--line);}
  .stat:last-child{border-bottom:0;}
  .stat:nth-child(2){border-bottom:1px solid var(--line);}
  .heroTitle{font-size:clamp(48px,19vw,68px);}
  .tHead{display:block;}
  .tWhen{display:block;margin-top:5px;white-space:normal;}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
`;
