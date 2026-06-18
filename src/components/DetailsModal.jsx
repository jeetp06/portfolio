import { useEffect } from "react";

export default function DetailsModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const title = item.title || item.role;
  const subtitle = item.org ? `${item.org} / ${item.place}` : item.when;
  const details = item.details || item.points || [];
  const stack = item.stack || {};
  const hasLanguages = Array.isArray(stack.languages) && stack.languages.length > 0;
  const hasFrameworks = Array.isArray(stack.frameworks) && stack.frameworks.length > 0;
  const hasTools = Array.isArray(stack.tools) && stack.tools.length > 0;
  const showStack = hasLanguages || hasFrameworks || hasTools;
  const detailsHeading = item.org ? "Key contributions" : "More details";

  const renderStackGroup = (label, items) => {
    if (!Array.isArray(items) || items.length === 0) return null;
    return (
      <div>
        <span>{label}</span>
        <p>{items.join(", ")}</p>
      </div>
    );
  };

  return (
    <div className="modalOverlay" role="presentation" onClick={onClose}>
      <div className="modalPanel" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" type="button" onClick={onClose} aria-label="Close details">×</button>
        <p className="modalKicker">{item.tag || item.when}</p>
        <h3 id="detail-title">{title}</h3>
        <p className="modalSub">{subtitle}</p>
        {item.body && <p className="modalBody">{item.body}</p>}

        {showStack && (
          <div className="modalStack">
            {renderStackGroup("Languages", stack.languages)}
            {renderStackGroup("Frameworks", stack.frameworks)}
            {renderStackGroup(item.org ? "Tools / Outcomes" : "Tools", stack.tools)}
          </div>
        )}

        <p className="modalSectionTitle">{detailsHeading}</p>
        <ul className="modalList">
          {details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
      </div>
    </div>
  );
}
