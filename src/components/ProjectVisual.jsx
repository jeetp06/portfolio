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

export default function ProjectVisual({ title }) {
  if (title === "Apple Options Volatility Prediction") return <VolatilityMiniChart />;
  if (title === "Asynchronous Image Flood-Fill Engine") return <FloodFillMiniChart />;
  if (title === "CookingPal - Pantry & Recipes") return <PantryMiniChart />;
  return null;
}
