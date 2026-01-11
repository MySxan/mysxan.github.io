// SkillGroup component - displays a category of skills
import { useTranslation } from "react-i18next";
import type { SkillCategory } from "../../data/skills";
import { Tag } from "./Tag";

interface SkillGroupProps {
  group: SkillCategory;
}

export function SkillGroup({ group }: SkillGroupProps) {
  const { t } = useTranslation();
  return (
    <div className="skill-group">
      <h3 className="skill-category">{t(group.categoryKey)}</h3>
      <p className="skill-description">{t(group.descriptionKey)}</p>
      <div className="skills-list">
        {group.skillKeys.map((skillKey) => (
          <Tag key={skillKey} size="md">
            {t(skillKey)}
          </Tag>
        ))}
      </div>
    </div>
  );
}
