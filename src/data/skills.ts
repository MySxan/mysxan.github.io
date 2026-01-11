// Skills data with categories
export interface SkillCategory {
  categoryKey: string;
  descriptionKey: string;
  skillKeys: string[];
}

export const skills: SkillCategory[] = [
  {
    categoryKey: "aboutSkills.engineering.title",
    descriptionKey: "aboutSkills.engineering.description",
    skillKeys: [
      "react",
      "typescript",
      "c++",
      "python",
      "java",
      "vite",
      "tailwind CSS",
      "aboutSkills.engineering.skills.responsive",
    ],
  },
  {
    categoryKey: "aboutSkills.visual.title",
    descriptionKey: "aboutSkills.visual.description",
    skillKeys: [
      "figma",
      "mastergo",
      "illustrator",
      "affinity",
      "fontlab",
      "TouchDesigner",
      "aboutSkills.visual.skills.interactive",
    ],
  },
  {
    categoryKey: "aboutSkills.creative.title",
    descriptionKey: "aboutSkills.creative.description",
    skillKeys: [
      "blender",
      "affinity",
      "procreate",
      "Photoshop",
      "fl studio",
      "aboutSkills.creative.skills.transcription",
      "aboutSkills.creative.skills.soundtrack",
    ],
  },
];
