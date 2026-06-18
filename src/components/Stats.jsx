import { STATS } from "../data/portfolioData";

export default function Stats() {
  return (
    <section className="stats" data-reveal>
      {STATS.map((stat) => (
        <div className="stat" key={stat.label}>
          <span className="statNum">{stat.value}</span>
          <span className="statLab">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
