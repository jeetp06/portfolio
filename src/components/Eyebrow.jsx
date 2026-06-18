export default function Eyebrow({ children }) {
  return (
    <span className="eyebrow">
      <i className="cell" />
      {children}
    </span>
  );
}
