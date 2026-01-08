import { useState } from "react";
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
  const [selectedId, setSelectedId] = useState(showcaseProjects[0]?.id || "");
  const [prevId, setPrevId] = useState(selectedId);
  const [prevIndex, setPrevIndex] = useState(0);

  const selectedProject = showcaseProjects.find((p) => p.id === selectedId);
  const prevProject = showcaseProjects.find((p) => p.id === prevId);
  const currentIndex = showcaseProjects.findIndex((p) => p.id === selectedId);

  const handleSelectProject = (id: string) => {
    setPrevIndex(currentIndex);
    setPrevId(selectedId);
    setSelectedId(id);
  };

  const slideDirection = currentIndex > prevIndex ? "down" : "up";

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
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Section id="projects" title="Projects" className="projects-section">
      <div className="projects-list-detail">
        {/* Left: Project List */}
        <div className="projects-list">
          {showcaseProjects.map((project) => (
            <button
              key={project.id}
              className={`projects-list-item ${
                selectedId === project.id ? "active" : ""
              }`}
              onClick={() => handleSelectProject(project.id)}
            >
              <div className="projects-list-item-title">{project.title}</div>
              <div className="projects-list-item-year">{project.year}</div>
            </button>
          ))}
        </div>

        {/* Right: Project Details - Stacked for animation */}
        <div className="projects-detail-container">
          {prevProject &&
            prevId !== selectedId &&
            renderCard(prevProject, false)}
          {renderCard(selectedProject, true)}
        </div>
      </div>
    </Section>
  );
}
