import { SKILLS } from "../data/portfolioData";
import Eyebrow from "./Eyebrow";

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="sectionHead" data-reveal>
        <Eyebrow>toolkit</Eyebrow>
        <h2>Languages, libraries, and the things around them.</h2>
      </div>
      <div className="skillCols">
        {SKILLS.map((group, i) => (
          <div className="skillCol" data-reveal style={{ transitionDelay: `${i * 70}ms` }} key={group.label}>
            <p className="skillLabel">{group.label}</p>
            <div className="chips">{group.items.map((item) => <span className="chip" key={item}>{item}</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
