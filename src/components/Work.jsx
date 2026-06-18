import { useState } from "react";
import { WORK } from "../data/portfolioData";
import DetailsModal from "./DetailsModal";
import Eyebrow from "./Eyebrow";
import ProjectVisual from "./ProjectVisual";

export default function Work() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [];

  for (let i = 0; i < WORK.length; i += 2) {
    slides.push(WORK.slice(i, i + 2));
  }

  const activeSlide = slides[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  };

  const goToNext = () => {
    setActiveIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
  };

  return (
    <section className="section" id="work">
      <div className="sectionHead workHead" data-reveal>
        <div>
          <Eyebrow>selected work</Eyebrow>
          <h2>Things I&apos;ve built, end to end.</h2>
          <p className="sectionNote">Click on the project to learn more.</p>
        </div>
        <div className="carouselControls" aria-label="Project slideshow controls">
          <button type="button" onClick={goToPrevious} aria-label="Previous projects">&lsaquo;</button>
          <span>{activeIndex + 1} / {slides.length}</span>
          <button type="button" onClick={goToNext} aria-label="Next projects">&rsaquo;</button>
        </div>
      </div>

      <div className="workCarousel" data-reveal>
        <div className="projectSlide" key={activeIndex}>
          {activeSlide.map((work) => (
            <article
              className="card carouselCard clickableCard"
              key={work.title}
              tabIndex="0"
              role="button"
              onClick={() => setSelectedWork(work)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedWork(work);
              }}
            >
              <div className="cardContent">
                <div className="cardTop">
                  <span className="cardTag">{work.tag}</span>
                  <span className="cardMetric">{work.metric}</span>
                </div>
                <h3>{work.title}</h3>
                <p className="cardWhen">{work.when}</p>
                <p className="cardBody">{work.body}</p>
              </div>
              <ProjectVisual title={work.title} />
            </article>
          ))}
        </div>

        <div className="carouselDots" aria-label="Choose project slide">
          {slides.map((slide, index) => (
            <button
              type="button"
              className={index === activeIndex ? "on" : ""}
              key={slide.map((work) => work.title).join("-")}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show projects ${index * 2 + 1} through ${Math.min(index * 2 + 2, WORK.length)}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      </div>

      <DetailsModal item={selectedWork} onClose={() => setSelectedWork(null)} />
    </section>
  );
}
