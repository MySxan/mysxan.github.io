import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showcaseProjects, type ProjectLink } from "../../data/projects";
import { Section } from "../ui/Section";

const pickBtnClass = (variant?: ProjectLink["variant"]) => {
  switch (variant) {
    case "primary":
      return "btn btn-primary";
    case "ghost":
      return "btn btn-ghost";
    case "secondary":
    default:
      return "btn btn-secondary";
  }
};

export function Projects() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(showcaseProjects[0]?.id || "");
  const [prevId, setPrevId] = useState(selectedId);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const selectedProject = showcaseProjects.find((p) => p.id === selectedId);
  const prevProject = showcaseProjects.find((p) => p.id === prevId);
  const currentIndex = showcaseProjects.findIndex((p) => p.id === selectedId);

  const handleSelectProject = (id: string) => {
    if (id === selectedId) return;
    setPrevIndex(currentIndex);
    setPrevId(selectedId);
    setSelectedId(id);
  };

  const slideDirection = currentIndex > prevIndex ? "down" : "up";

  const linkLabelKeyMap: Record<
    ProjectLink["label"],
    "repository" | "liveDemo" | "caseStudy" | "website" | "tapTap"
  > = {
    Repository: "repository",
    "Live Demo": "liveDemo",
    "Case Study": "caseStudy",
    Website: "website",
    TapTap: "tapTap",
  };

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  if (!selectedProject) return null;

  const renderCard = (project: typeof selectedProject, isActive: boolean) => (
    <div
      key={`${project.id}-${isActive ? "active" : "prev"}`}
      className={`card card-default projects-detail ${
        isActive ? `slide-${slideDirection}` : "slide-out"
      }`}
    >
      <div className="card-header">
        <div className="project-header">
          <h3 className="project-title">{project.title}</h3>
          <span className="project-year">{project.year}</span>
        </div>
      </div>

      <div className="card-body">
        <p className="project-oneLiner">{project.oneLiner}</p>

        <ul className="project-highlights">
          {project.highlights.map((highlight: string) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <div className="project-tags">
          {project.tags.map((tag: string) => (
            <span key={tag} className="tag tag-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="project-links">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={pickBtnClass(link.variant)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(`projects.links.${linkLabelKeyMap[link.label]}`)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMobileDetail = (project: typeof selectedProject) => (
    <div className="projects-detail-inline">
      <div
        className={`card card-default projects-detail-mobile slide-${slideDirection}`}
      >
        <div className="card-header">
          <div className="project-header">
            <h3 className="project-title">{project.title}</h3>
            <span className="project-year">{project.year}</span>
          </div>
        </div>
        <div className="card-body">
          <p className="project-oneLiner">{project.oneLiner}</p>
          <ul className="project-highlights">
            {project.highlights.map((highlight: string) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="project-tags">
            {project.tags.map((tag: string) => (
              <span key={tag} className="tag tag-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="card-footer">
          <div className="project-links">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={pickBtnClass(link.variant)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(`projects.links.${linkLabelKeyMap[link.label]}`)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Section
      id="projects"
      title={t("projects.title")}
      className="projects-section"
    >
      <div className={`projects-list-detail ${isMobile ? "mobile" : ""}`}>
        {/* Left: Project List */}
        <div className="projects-list">
          {showcaseProjects.map((project) => {
            const isActive = selectedId === project.id;
            if (isMobile) {
              return (
                <div key={project.id} className="projects-list-row">
                  <button
                    className={`projects-list-item ${isActive ? "active" : ""}`}
                    onClick={() => handleSelectProject(project.id)}
                    aria-expanded={isActive}
                    aria-controls={`project-detail-${project.id}`}
                  >
                    <div className="projects-list-item-title">
                      {project.title}
                    </div>
                    <div className="projects-list-item-year">
                      {project.year}
                    </div>
                  </button>
                  {isActive && (
                    <div id={`project-detail-${project.id}`} key={project.id}>
                      {renderMobileDetail(project)}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={project.id}
                className={`projects-list-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelectProject(project.id)}
              >
                <div className="projects-list-item-title">{project.title}</div>
                <div className="projects-list-item-year">{project.year}</div>
              </button>
            );
          })}
        </div>

        {/* Right: Project Details - Stacked for animation */}
        {!isMobile && (
          <div className="projects-detail-container">
            {prevProject &&
              prevId !== selectedId &&
              renderCard(prevProject, false)}
            {renderCard(selectedProject, true)}
          </div>
        )}
      </div>
    </Section>
  );
}
