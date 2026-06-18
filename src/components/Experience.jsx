import { EXPERIENCE } from "../data/portfolioData";
import Eyebrow from "./Eyebrow";

export default function Experience() {
  return (
    <section className="section sectionAlt" id="experience">
      <div className="sectionHead" data-reveal>
        <Eyebrow>experience</Eyebrow>
        <h2>Where I&apos;ve done the work.</h2>
      </div>
      <div className="timeline">
        {EXPERIENCE.map((experience, i) => (
          <div className="tItem" data-reveal style={{ transitionDelay: `${i * 60}ms` }} key={experience.org}>
            <div className="tNode"><i /></div>
            <div className="tCard">
              <div className="tHead">
                <h3>{experience.role}</h3>
                <span className="tWhen">{experience.when}</span>
              </div>
              <p className="tOrg">{experience.org} <span>/ {experience.place}</span></p>
              <ul>{experience.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
