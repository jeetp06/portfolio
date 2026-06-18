import { useState } from "react";
import { EXPERIENCE } from "../data/portfolioData";
import DetailsModal from "./DetailsModal";
import Eyebrow from "./Eyebrow";

export default function Experience() {
  const [selectedExperience, setSelectedExperience] = useState(null);

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
            <div
              className="tCard clickableCard"
              tabIndex="0"
              role="button"
              onClick={() => setSelectedExperience(experience)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedExperience(experience);
              }}
            >
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
      <DetailsModal item={selectedExperience} onClose={() => setSelectedExperience(null)} />
    </section>
  );
}
