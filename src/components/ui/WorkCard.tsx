// WorkCard component - displays individual work item in grid
import { useTranslation } from "react-i18next";
import type { Work } from "../../data/works";

interface WorkCardProps {
  work: Work;
  onClick: () => void;
  aspectRatio: string;
  imageHeight: number;
  setCardRef: (element: HTMLDivElement | null) => void;
  setImageRef: (element: HTMLImageElement | null) => void;
}

export function WorkCard({
  work,
  onClick,
  aspectRatio,
  imageHeight,
  setCardRef,
  setImageRef,
}: WorkCardProps) {
  const { t } = useTranslation();

  return (
    <div
      ref={setCardRef}
      className="work-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={t("works.viewItem", { title: work.title })}
    >
      <div className="work-card-image" style={{ aspectRatio }}>
        <img
          ref={setImageRef}
          src={work.thumbnail}
          alt={work.title}
          loading="lazy"
          style={{ height: `${imageHeight}%` }}
        />
        <div className="work-overlay">
          <span className="overlay-text">{t("works.view")}</span>
        </div>
      </div>
      <div className="work-card-info">
        <h3 className="work-title">{work.title}</h3>
        <div className="work-meta">
          <span className="work-type">{work.type}</span>
          <span className="work-year">{work.year}</span>
        </div>
      </div>
    </div>
  );
}
