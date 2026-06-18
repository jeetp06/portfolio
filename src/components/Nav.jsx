import { RESUME_URL } from "../data/portfolioData";

export default function Nav({ scrolled, menuOpen, setMenuOpen, theme, onToggleTheme }) {
  return (
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
      <button className="themeBtn" onClick={onToggleTheme} aria-label="Toggle color theme">
        <span className="themeGlyph">{theme === "dark" ? "☀" : "☾"}</span>
        <span className="themeWord">{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
    </header>
  );
}
