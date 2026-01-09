// Hero section component - main landing section with introduction
import { useTranslation } from "react-i18next";
import { Container } from "../ui/Container";

export function Hero() {
  const { t } = useTranslation();
  const skills = t("hero.skills", { returnObjects: true }) as Array<{
    label: string;
    sub?: string;
  }>;

  return (
    <section id="hero" className="hero">
      <Container>
        <div className="hero-overlay-grid">
          <div className="hero-left">
            <img
              src="/img/logo.png"
              alt="Logo"
              className="hero-logo"
              style={{ "--enter-delay": "0.3s" } as React.CSSProperties}
            />
            <p
              className="hero-tagline"
              style={{ "--enter-delay": "0.36s" } as React.CSSProperties}
            >
              {t("hero.tagline")}
            </p>
            <p
              className="hero-intro"
              style={{ "--enter-delay": "0.6s" } as React.CSSProperties}
            >
              {t("hero.intro")}
            </p>
          </div>

          <div className="hero-right">
            <ul className="hero-skill-list">
              {skills.map((skill, idx) => (
                <li
                  key={`${skill.label}-${idx}`}
                  style={
                    { "--delay": `${0.3 + idx * 0.06}s` } as React.CSSProperties
                  }
                >
                  <span className="skill-label">
                    {skill.label.toUpperCase()}
                  </span>
                  {skill.sub && <span className="skill-sub">{skill.sub}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="scroll-indicator">
          <span></span>
        </div>
      </Container>
    </section>
  );
}
