// Project Link Types
export type ProjectLinkVariant = "primary" | "secondary" | "ghost";

export interface ProjectLink {
  label: "Live Demo" | "Repository" | "Case Study";
  href: string;
  variant?: ProjectLinkVariant;
}

// Showcase Project (Featured + Compact Layout)
export interface ShowcaseProject {
  id: string;
  cnTitle?: string;
  title: string;
  year: string;
  oneLiner: string;
  highlights: string[];
  tags: string[];
  links: ProjectLink[];
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "phigrim",
    title: "Phigrim",
    year: "2025",
    oneLiner:
      "Community rhythm game with chart upload/browse + in-game downloader.",
    highlights: [
      "Designed end-to-end UX for chart discovery and installation",
      "Built modular chart pipeline and metadata validation",
      "Optimized scroll + asset loading for smooth mobile performance",
    ],
    tags: ["React", "TypeScript", "Node.js", "RAG", "Design System"],
    links: [
      { label: "Repository", href: "#", variant: "primary" },
      { label: "Live Demo", href: "#", variant: "secondary" },
    ],
  },
  {
    id: "arxsbot",
    title: "ArxsBot",
    year: "2025",
    oneLiner:
      "Modular QQ bot with adapters/plugins + storage-ready architecture.",
    highlights: [
      "Adapter-first design",
      "Plugin framework",
      "Policy/risk module",
    ],
    tags: ["TypeScript", "NapCat", "Monorepo"],
    links: [
      { label: "Repository", href: "#", variant: "primary" },
      { label: "Live Demo", href: "#", variant: "secondary" },
    ],
  },
  {
    id: "wordle-helper",
    title: "wordle-helper",
    year: "2024",
    oneLiner:
      "Comprehensive component library with 50+ reusable UI components and design tokens.",
    highlights: [
      "Built Storybook documentation with live previews",
      "Implemented theming system with light/dark modes",
      "Created accessibility guidelines and WCAG compliance standards",
    ],
    tags: ["React", "TypeScript", "Storybook", "CSS-in-JS", "A11y"],
    links: [
      { label: "Repository", href: "#", variant: "primary" },
      { label: "Live Demo", href: "#", variant: "secondary" },
    ],
  },
  {
    id: "course-scheduler",
    title: "course-scheduler",
    year: "2024",
    oneLiner:
      "Interactive dashboard for tracking application metrics and user behavior patterns.",
    highlights: [
      "Real-time data sync with WebSocket connections",
      "Advanced chart visualizations with D3.js",
      "Custom filtering and drill-down capabilities",
    ],
    tags: ["React", "Node.js", "D3.js", "WebSocket", "PostgreSQL"],
    links: [
      { label: "Repository", href: "#", variant: "primary" },
      { label: "Live Demo", href: "#", variant: "secondary" },
    ],
  },
  {
    id: "uniscraper",
    title: "uniscraper",
    year: "2024",
    oneLiner:
      "Native iOS and Android application for task management and team collaboration.",
    highlights: [
      "Built with React Native for code sharing",
      "Offline-first architecture with local sync",
      "Push notifications and real-time updates",
    ],
    tags: ["React Native", "TypeScript", "Firebase", "Redux", "Expo"],
    links: [
      { label: "Repository", href: "#", variant: "primary" },
      { label: "Live Demo", href: "#", variant: "secondary" },
    ],
  },
  {
    id: "ai-translator-extension",
    title: "ai-translator-extension",
    year: "2023",
    oneLiner:
      "API-first content management system with flexible content modeling and multi-language support.",
    highlights: [
      "GraphQL API for flexible content querying",
      "Webhook-based publishing pipeline",
      "Role-based access control and audit logs",
    ],
    tags: ["Node.js", "GraphQL", "MongoDB", "TypeScript", "Docker"],
    links: [
      { label: "Repository", href: "#", variant: "primary" },
      { label: "Live Demo", href: "#", variant: "secondary" },
    ],
  },
];
