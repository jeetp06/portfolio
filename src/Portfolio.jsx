import { useEffect, useState } from "react";
import Contact from "./components/Contact";
import ExperienceSection from "./components/Experience";
import Footer from "./components/Footer";
import HeroSection from "./components/Hero";
import Nav from "./components/Nav";
import SkillsSection from "./components/Skills";
import StatsSection from "./components/Stats";
import WorkSection from "./components/Work";
import useReveal from "./hooks/useReveal";

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
  return (
    <div className="root" data-theme={theme}>
      <style>{CSS}</style>

      <Nav
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <HeroSection mode={mode} setMode={setMode} seed={seed} setSeed={setSeed} theme={theme} />
      <StatsSection />
      <WorkSection />
      <ExperienceSection />
      <SkillsSection />
      <Contact />
      <Footer />
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
.workHead{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;}
.sectionNote{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--ink3);letter-spacing:.04em;margin:14px 0 0;}
.carouselControls{display:flex;align-items:center;gap:10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ink3);white-space:nowrap;}
.carouselControls button{width:38px;height:38px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);font-size:24px;line-height:1;cursor:pointer;transition:.22s;}
.carouselControls button:hover{border-color:var(--accent);color:var(--accent);transform:translateY(-2px);}
.workCarousel{display:flex;flex-direction:column;gap:18px;}
.projectSlide{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;animation:slideIn .34s ease both;}
.carouselCard{min-height:430px;}
.carouselCard .miniChart{height:176px;margin:16px 0 18px;order:2;}
.cardContent{display:flex;flex-direction:column;}
.carouselDots{display:flex;justify-content:center;gap:8px;}
.carouselDots button{width:9px;height:9px;border:1px solid var(--line);border-radius:999px;background:var(--card);padding:0;cursor:pointer;transition:.22s;}
.carouselDots button.on{width:28px;background:var(--accent);border-color:var(--accent);}
.workGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:26px 24px 28px;display:flex;flex-direction:column;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease;}
.card:hover{transform:translateY(-6px);box-shadow:0 18px 40px -22px rgba(0,0,0,.45);border-color:var(--accent);}
.clickableCard{cursor:pointer;}
.clickableCard:focus-visible{outline:2px solid var(--accent);outline-offset:4px;}
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
.pantryMini{display:block;background:linear-gradient(135deg,color-mix(in srgb,#34A853 12%,var(--card)),var(--card));}
.pantryMini::before{opacity:.38;}
.ocrPhone{position:absolute;left:20px;top:18px;width:36%;height:104px;border:1px solid color-mix(in srgb,var(--accent) 46%,var(--line));border-radius:14px;background:color-mix(in srgb,var(--card) 88%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--line) 50%,transparent);}
.lensCorner{position:absolute;width:18px;height:18px;border-color:#4285F4;opacity:.95;}
.lensCorner.topLeft{left:9px;top:9px;border-left:2px solid #4285F4;border-top:2px solid #4285F4;border-radius:6px 0 0 0;}
.lensCorner.topRight{right:9px;top:9px;border-right:2px solid #EA4335;border-top:2px solid #EA4335;border-radius:0 6px 0 0;}
.lensCorner.bottomLeft{left:9px;bottom:9px;border-left:2px solid #FBBC05;border-bottom:2px solid #FBBC05;border-radius:0 0 0 6px;}
.lensCorner.bottomRight{right:9px;bottom:9px;border-right:2px solid #34A853;border-bottom:2px solid #34A853;border-radius:0 0 6px 0;}
.receipt{position:absolute;left:28px;right:28px;top:20px;bottom:16px;padding:12px 10px;border-radius:8px;background:linear-gradient(180deg,#fff,color-mix(in srgb,#fff 88%,#DCE0E7));box-shadow:0 10px 24px -18px rgba(0,0,0,.5);}
.receipt span{display:block;height:7px;margin-bottom:9px;border-radius:999px;background:linear-gradient(90deg,#4285F4 0 24%,#EA4335 24% 48%,#FBBC05 48% 72%,#34A853 72%);font-size:0;opacity:.74;}
.receipt span:nth-child(2){width:82%;}
.receipt span:nth-child(3){width:64%;}
.scanLine{position:absolute;left:18px;right:18px;top:26px;height:2px;border-radius:999px;background:#34A853;box-shadow:0 0 18px rgba(52,168,83,.75);animation:ocrScan 2.2s ease-in-out infinite;}
.pantryShelf{position:absolute;left:44%;top:28px;width:20%;height:94px;border-bottom:3px solid color-mix(in srgb,var(--copper) 72%,var(--line));}
.foodItem{position:absolute;bottom:4px;display:block;filter:drop-shadow(0 10px 14px rgba(0,0,0,.24));animation:pantryPop 2.4s ease-in-out infinite;}
.foodItem.can{left:0;width:24px;height:34px;border-radius:7px;background:linear-gradient(180deg,var(--accent),color-mix(in srgb,var(--accent) 50%,var(--card)));}
.foodItem.carrot{left:34px;width:13px;height:42px;border-radius:999px;background:var(--copper);transform:rotate(16deg);animation-delay:.16s;}
.foodItem.carrot::before{content:"";position:absolute;left:-3px;top:-8px;width:18px;height:12px;border-radius:999px 999px 0 0;background:#34A853;}
.foodItem.jar{left:58px;width:25px;height:38px;border-radius:8px 8px 10px 10px;background:linear-gradient(180deg,#FBBC05,var(--copper));animation-delay:.32s;}
.flowArrow{position:absolute;left:64%;top:75px;width:42px;height:2px;border-radius:999px;background:linear-gradient(90deg,var(--accent),var(--copper));animation:fitPulse 2.2s ease-in-out infinite;}
.flowArrow::after{content:"";position:absolute;right:-1px;top:-5px;border-left:9px solid var(--copper);border-top:6px solid transparent;border-bottom:6px solid transparent;}
.recipeCardMini{position:absolute;right:22px;top:28px;width:25%;height:94px;border:1px solid var(--line);border-radius:12px;background:var(--card);padding:12px;box-shadow:0 14px 28px -24px rgba(0,0,0,.55);animation:recipeSuggest 2.4s ease-in-out infinite;}
.recipeThumb{display:block;width:42px;height:30px;border-radius:8px;background:radial-gradient(circle at 34% 42%,#EA4335 0 18%,transparent 19%),radial-gradient(circle at 62% 52%,#34A853 0 16%,transparent 17%),linear-gradient(135deg,#FBBC05,var(--copper));margin-bottom:10px;}
.recipeCardMini > span:not(.recipeThumb){display:block;height:6px;border-radius:999px;background:var(--ink3);opacity:.55;margin-bottom:7px;}
.recipeCardMini > span:nth-child(3){width:78%;}
.recipeCardMini > span:nth-child(4){width:58%;}
.matchMini{background:linear-gradient(135deg,color-mix(in srgb,#2E8B57 22%,var(--card)),var(--card));}
.matchMini::before{opacity:.28;}
.tennisCourt{position:absolute;inset:18px 24px 34px;border:2px solid color-mix(in srgb,var(--accent) 50%,#fff);border-radius:8px;background:linear-gradient(90deg,color-mix(in srgb,#2E8B57 34%,transparent),color-mix(in srgb,#5BA45B 16%,transparent));}
.tennisCourt::before,.tennisCourt::after{content:"";position:absolute;top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--accent) 44%,#fff);}
.tennisCourt::before{left:25%;}
.tennisCourt::after{right:25%;}
.courtLine{position:absolute;left:24px;right:24px;height:1px;background:color-mix(in srgb,var(--accent) 44%,#fff);}
.courtLine.serviceA{top:43%;}
.courtLine.serviceB{bottom:45%;}
.courtNet{position:absolute;left:50%;top:20px;bottom:36px;width:3px;border-radius:999px;background:linear-gradient(180deg,var(--accent),var(--copper));box-shadow:0 0 16px color-mix(in srgb,var(--accent) 34%,transparent);}
.tennisPlayer{position:absolute;width:18px;height:18px;border-radius:999px;background:var(--ink);box-shadow:0 0 0 5px color-mix(in srgb,var(--ink) 12%,transparent);}
.tennisPlayer.playerA{left:22%;bottom:28%;animation:tennisStep 1.8s ease-in-out infinite;}
.tennisPlayer.playerB{right:22%;top:26%;animation:tennisStep 1.8s ease-in-out infinite reverse;}
.tennisRacket{position:absolute;width:20px;height:28px;border:2px solid var(--copper);border-radius:999px;transform-origin:50% 90%;}
.tennisRacket::after{content:"";position:absolute;left:8px;bottom:-13px;width:3px;height:14px;border-radius:999px;background:var(--copper);}
.tennisRacket.racketA{left:30%;bottom:30%;transform:rotate(-32deg);animation:racketSwingA 1.8s ease-in-out infinite;}
.tennisRacket.racketB{right:30%;top:27%;transform:rotate(148deg);animation:racketSwingB 1.8s ease-in-out infinite;}
.tennisBall{position:absolute;width:12px;height:12px;border-radius:999px;background:#D7F75B;box-shadow:0 0 0 5px rgba(215,247,91,.18),0 0 18px rgba(215,247,91,.65);animation:tennisRally 1.8s cubic-bezier(.45,.05,.2,.95) infinite;}
.matchArc{position:absolute;left:31%;right:31%;top:34%;height:34%;border-top:2px dashed color-mix(in srgb,#D7F75B 72%,transparent);border-radius:50%;opacity:.7;animation:fitPulse 1.8s ease-in-out infinite;}
@keyframes slideIn{from{opacity:0;transform:translateX(18px);}to{opacity:1;transform:none;}}
@keyframes gridFill{0%,18%{background:color-mix(in srgb,var(--line) 72%,transparent);transform:scale(.96);}48%,100%{background:linear-gradient(135deg,var(--accent),var(--copper));transform:scale(1);}}
@keyframes scanMove{0%,100%{transform:translateY(0);opacity:.55;}50%{transform:translateY(52px);opacity:1;}}
@keyframes dotLearn{0%,100%{transform:translate(-50%,-50%) scale(.9);opacity:.72;}50%{transform:translate(-50%,-50%) scale(1.22);opacity:1;}}
@keyframes fitPulse{0%,100%{filter:saturate(1);opacity:.75;}50%{filter:saturate(1.4);opacity:1;}}
@keyframes barSignal{0%,100%{transform:scaleY(.76);opacity:.48;}50%{transform:scaleY(1);opacity:.9;}}
@keyframes tennisRally{0%,100%{left:31%;top:65%;}50%{left:66%;top:30%;}}
@keyframes tennisStep{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
@keyframes racketSwingA{0%,100%{transform:rotate(-32deg);}50%{transform:rotate(-8deg);}}
@keyframes racketSwingB{0%,100%{transform:rotate(148deg);}50%{transform:rotate(124deg);}}

/* TIMELINE */
.timeline{position:relative;padding-left:28px;}
.timeline::before{content:"";position:absolute;left:5px;top:6px;bottom:6px;width:1.5px;background:var(--line);}
.tItem{position:relative;margin-bottom:26px;}
.tNode{position:absolute;left:-28px;top:6px;}
.tNode i{display:block;width:11px;height:11px;border-radius:2px;background:linear-gradient(135deg,var(--accent),var(--copper));box-shadow:0 0 0 4px var(--paper2);}
.tCard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 24px;}
.tCard.clickableCard{transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease;}
.tCard.clickableCard:hover{transform:translateY(-3px);border-color:var(--accent);box-shadow:0 18px 40px -28px rgba(0,0,0,.42);}
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

/* MODAL */
.modalOverlay{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(8,10,14,.58);backdrop-filter:blur(10px);}
.modalPanel{position:relative;width:min(680px,100%);max-height:82vh;overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:30px;box-shadow:0 28px 70px -28px rgba(0,0,0,.65);}
.modalClose{position:absolute;top:14px;right:14px;width:34px;height:34px;border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);font-size:22px;line-height:1;cursor:pointer;}
.modalClose:hover{border-color:var(--accent);color:var(--accent);}
.modalKicker{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);margin:0 42px 10px 0;}
.modalPanel h3{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(26px,4vw,40px);line-height:1;margin:0 42px 8px 0;letter-spacing:-.025em;}
.modalSub{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--ink3);margin:0 0 18px;}
.modalBody{font-size:15px;color:var(--ink2);margin:0 0 18px;line-height:1.65;}
.modalStack{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0 0 22px;}
.modalStack div{border:1px solid var(--line);border-radius:10px;background:color-mix(in srgb,var(--paper) 44%,var(--card));padding:13px 14px;}
.modalStack span,.modalSectionTitle{font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);}
.modalStack p{font-size:14px;line-height:1.45;color:var(--ink);margin:7px 0 0;}
.modalSectionTitle{margin:0 0 10px;}
.modalList{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:9px;color:var(--ink2);font-size:14.5px;}
.modalList li::marker{color:var(--accent);}

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
  .workHead{align-items:flex-start;flex-direction:column;margin-bottom:34px;}
  .carouselControls{width:100%;justify-content:space-between;}
  .projectSlide{grid-template-columns:1fr;}
  .carouselCard{min-height:auto;}
  .carouselCard .miniChart{min-height:220px;}
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
  .modalPanel{padding:26px 20px;}
  .modalStack{grid-template-columns:1fr;}
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
