import Eyebrow from "./Eyebrow";
import FloodCanvas from "./FloodCanvas";

export default function Hero({ mode, setMode, seed, setSeed, theme }) {
  return (
    <section className="hero" id="top">
      <FloodCanvas mode={mode} theme={theme} onSeedChange={setSeed} />
      <div className="heroInner">
        <Eyebrow>math + computer science / uiuc</Eyebrow>
        <h1 className="heroTitle">Jeet<br />Pancholi</h1>
        <p className="heroLede">
          I build systems that <em>traverse, organize, and predict</em> - from a
          BFS flood-fill engine in C++ to volatility models that hit R2&nbsp;0.97.
          Mathematics &amp; CS undergrad, graduating December&nbsp;2027.
        </p>
        <div className="heroControls">
          <span className="ctrlLabel">flood fill - click the grid to re-seed</span>
          <div className="toggle" role="group" aria-label="traversal mode">
            <button className={mode === "BFS" ? "on" : ""} onClick={() => setMode("BFS")} aria-pressed={mode === "BFS"}>BFS</button>
            <button className={mode === "DFS" ? "on" : ""} onClick={() => setMode("DFS")} aria-pressed={mode === "DFS"}>DFS</button>
          </div>
        </div>
      </div>
      <div className="heroCoord">x:{seed.x.toFixed(2)} y:{seed.y.toFixed(2)} - seed</div>
    </section>
  );
}
