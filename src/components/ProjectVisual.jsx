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
  <div className="miniChart pantryMini" aria-label="Animated OCR pantry and recipe recommendation flow">
    <div className="ocrPhone">
      <span className="lensCorner topLeft" />
      <span className="lensCorner topRight" />
      <span className="lensCorner bottomLeft" />
      <span className="lensCorner bottomRight" />
      <div className="receipt">
        <span>milk</span>
        <span>eggs</span>
        <span>rice</span>
      </div>
      <span className="scanLine" />
    </div>
    <div className="pantryShelf">
      <span className="foodItem can" />
      <span className="foodItem carrot" />
      <span className="foodItem jar" />
    </div>
    <span className="flowArrow" />
    <div className="recipeCardMini">
      <span className="recipeThumb" />
      <span />
      <span />
      <span />
    </div>
    <span className="chartLabel">OCR pantry to recipes</span>
  </div>
);

const MatchPointMiniChart = () => (
  <div className="miniChart matchMini" aria-label="Animated tennis match preview">
    <span className="tennisCourt" />
    <span className="courtLine serviceA" />
    <span className="courtLine serviceB" />
    <span className="courtNet" />
    <span className="tennisPlayer playerA" />
    <span className="tennisPlayer playerB" />
    <span className="tennisRacket racketA" />
    <span className="tennisRacket racketB" />
    <span className="tennisBall" />
    <span className="matchArc" />
    <span className="chartLabel">tennis match finder</span>
  </div>
);

export default function ProjectVisual({ title }) {
  if (title === "MatchPoint") return <MatchPointMiniChart />;
  if (title === "Apple Options Volatility Prediction") return <VolatilityMiniChart />;
  if (title === "Asynchronous Image Flood-Fill Engine") return <FloodFillMiniChart />;
  if (title === "CookingPal - Pantry & Recipes") return <PantryMiniChart />;
  return null;
}
