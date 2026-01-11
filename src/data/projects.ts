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
  oneLinerKey: string;
  highlightKeys: string[];
  tags: string[];
  links: ProjectLink[];
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "phigrim",
    title: "Phigrim",
    year: "2023",
    oneLinerKey: "projects.items.phigrim.oneLiner",
    highlightKeys: [
      "projects.items.phigrim.highlights.0",
      "projects.items.phigrim.highlights.1",
      "projects.items.phigrim.highlights.2",
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
    oneLinerKey: "projects.items.arxsbot.oneLiner",
    highlightKeys: [
      "projects.items.arxsbot.highlights.0",
      "projects.items.arxsbot.highlights.1",
      "projects.items.arxsbot.highlights.2",
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
    year: "2024",
    oneLinerKey: "projects.items.wordleHelper.oneLiner",
    highlightKeys: [
      "projects.items.wordleHelper.highlights.0",
      "projects.items.wordleHelper.highlights.1",
      "projects.items.wordleHelper.highlights.2",
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
    oneLinerKey: "projects.items.courseScheduler.oneLiner",
    highlightKeys: [
      "projects.items.courseScheduler.highlights.0",
      "projects.items.courseScheduler.highlights.1",
      "projects.items.courseScheduler.highlights.2",
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
    oneLinerKey: "projects.items.uniscraper.oneLiner",
    highlightKeys: [
      "projects.items.uniscraper.highlights.0",
      "projects.items.uniscraper.highlights.1",
      "projects.items.uniscraper.highlights.2",
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
    oneLinerKey: "projects.items.aiTranslator.oneLiner",
    highlightKeys: [
      "projects.items.aiTranslator.highlights.0",
      "projects.items.aiTranslator.highlights.1",
      "projects.items.aiTranslator.highlights.2",
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
