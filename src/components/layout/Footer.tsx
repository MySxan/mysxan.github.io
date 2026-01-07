// Footer component - page footer with copyright, tagline, and social links
import { Container } from "../ui/Container";
import { links } from "../../data/links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-copyright">
              &copy; {currentYear} MySxan. All rights reserved.
            </p>
            <p className="footer-tagline">
              Crafted with React, TypeScript, and creative passion.
            </p>
          </div>

          <div className="footer-social">
            <div className="social-links-footer">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-footer"
                  aria-label={link.label}
                  title={link.label}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
