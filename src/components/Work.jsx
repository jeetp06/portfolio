import { WORK } from "../data/portfolioData";
import Eyebrow from "./Eyebrow";
import ProjectVisual from "./ProjectVisual";

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="sectionHead" data-reveal>
        <Eyebrow>selected work</Eyebrow>
        <h2>Things I&apos;ve built, end to end.</h2>
      </div>
      <div className="workGrid">
        {WORK.map((work, i) => (
          <article className="card" data-reveal style={{ transitionDelay: `${i * 70}ms` }} key={work.title}>
            <div className="cardTop">
              <span className="cardTag">{work.tag}</span>
              <span className="cardMetric">{work.metric}</span>
            </div>
            <h3>{work.title}</h3>
            <p className="cardWhen">{work.when}</p>
            <ProjectVisual title={work.title} />
            <p className="cardBody">{work.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
