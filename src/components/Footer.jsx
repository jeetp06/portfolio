export default function Footer() {
  return (
    <footer className="foot">
      <span>&copy; {new Date().getFullYear()} Jeet Pancholi</span>
      <span className="footMono">built with react / seeded with BFS</span>
    </footer>
  );
}
