// Footer component - page footer with copyright, tagline, and social links
import { useTranslation } from "react-i18next";
import { Container } from "../ui/Container";
import { links } from "../../data/links";
import {
  FaGithub,
  FaLinkedin,
  FaSpotify,
  FaQq,
} from "react-icons/fa";
import { SiX } from "react-icons/si";
import { SiPixiv, SiBilibili, SiBandcamp } from "react-icons/si";
import { RiNeteaseCloudMusicLine } from "react-icons/ri";
import type { IconType } from "react-icons";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const ICONS: Record<string, IconType> = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: SiX,
    pixiv: SiPixiv,
    bilibili: SiBilibili,
    bandcamp: SiBandcamp,
    spotify: FaSpotify,
    qq: FaQq,
    netease: RiNeteaseCloudMusicLine,
  };

  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-copyright">
              {t("footer.copyright", { year: currentYear })}
            </p>
            <p className="footer-tagline">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="footer-social">
            {links.map((link) => {
              const Icon = ICONS[link.icon] ?? FaGithub;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={link.label}
                  title={link.label}
                >
                  <Icon className="footer-icon" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
