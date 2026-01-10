// Project Link Types
export type ProjectLinkVariant = "primary" | "secondary" | "ghost";

export interface ProjectLink {
  label: "Live Demo" | "Repository" | "Case Study" | "Website" | "TapTap";
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
    year: "2023",
    oneLiner:
      "Mobile community rhythm game with in-game chart discovery, download, and installation.",
    highlights: [
      "Designed end-to-end UX for chart discovery and installation",
      "Built modular chart pipeline and metadata validation",
      "Optimized scroll + asset loading for smooth mobile performance",
    ],
    tags: ["Unity", "MasterGo", "UI/UX", "Design System"],
    links: [
      {
        label: "Website",
        href: "https://www.phigrim.cn/en/",
        variant: "primary",
      },
      {
        label: "TapTap",
        href: "https://www.taptap.cn/app/241790",
        variant: "secondary",
      },
    ],
  },
  {
    id: "arxsbot",
    title: "ArxsBot",
    year: "2025",
    oneLiner:
      "A TypeScript multiplatform chat bot project using pnpm + Vitest.",
    highlights: [
      "TypeScript codebase with separated config/, src/, and tests/ structure",
      "pnpm workspace setup for multi-package / modular growth",
      "Test-ready setup via Vitest config",
    ],
    tags: ["TypeScript", "pnpm", "Vitest", "Node.js", "Monorepo"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/MySxan/ArxsBot",
        variant: "primary",
      },
    ],
  },
  {
    id: "wordle-helper",
    title: "Wordle Helper",
    year: "2025",
    oneLiner:
      "React-based Wordle helper that filters candidates based on guess feedback.",
    highlights: [
      "Real-time input with backspace editing for guesses",
      "Color-coded feedback (green/yellow/gray) to refine results",
      "Filters possible words and shows a definition when one remains",
    ],
    tags: ["React", "JavaScript", "Vite", "Tailwind CSS", "Wordle"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/MySxan/wordle-helper",
        variant: "primary",
      },
      {
        label: "Live Demo",
        href: "https://mysxan.com/wordle-helper/",
        variant: "secondary",
      },
    ],
  },
  {
    id: "course-scheduler",
    title: "Course Scheduler",
    year: "2025",
    oneLiner:
      "Web-based course scheduling app for building and exporting weekly timetables.",
    highlights: [
      "Visual weekly timetable with configurable time ranges",
      "CSV import for bulk course setup",
      "Export schedules as PNG images",
    ],
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Papaparse"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/MySxan/course-scheduler",
        variant: "primary",
      },
    ],
  },
  {
    id: "uniscraper",
    title: "UniScraper",
    year: "2025",
    oneLiner:
      "Multi-source university ranking scraper + merger that deduplicates and outputs unified CSV datasets.",
    highlights: [
      "Scrapes QS, THE, and US News rankings",
      "Unified merge script with dedup rules to avoid false merges",
      "Produces merged CSV outputs and logs for traceability",
    ],
    tags: [
      "Python",
      "Selenium",
      "Pandas",
      "KaggleHub",
      "Web Scraping",
      "Data Merge",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/MySxan/uniscraper",
        variant: "primary",
      },
    ],
  },
  {
    id: "ai-translator-extension",
    title: "AI Translator Extension",
    year: "2025",
    oneLiner: "Chrome extension for AI-powered translation.",
    highlights: [
      "Background service worker handles translate requests via messaging",
      "Popup UI for quick interaction and a dedicated settings page",
      "Standard Chrome extension packaging via manifest.json",
    ],
    tags: ["JavaScript", "Chrome Extension", "Manifest V3", "API Integration"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/MySxan/ai-translator-extension",
        variant: "primary",
      },
    ],
  },
];
