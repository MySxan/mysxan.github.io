// Navbar component - responsive navigation with smooth scroll and active section highlighting
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState("hero");
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorW, setIndicatorW] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const [menuIndicatorY, setMenuIndicatorY] = useState(0);
  const [menuIndicatorH, setMenuIndicatorH] = useState(0);
  const [menuIndicatorVisible, setMenuIndicatorVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const linksRef = useRef<HTMLUListElement>(null);
  const menuLinksRef = useRef<HTMLUListElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lenis = window.__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // IntersectionObserver to detect active section
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const list = linksRef.current;
      if (!list) return;
      const active = list.querySelector("a.active") as HTMLAnchorElement | null;
      if (!active) {
        setIndicatorVisible(false);
        return;
      }
      setIndicatorVisible(true);
      const rect = active.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const x = rect.left - listRect.left; // align left with link
      const w = rect.width; // match link width
      setIndicatorX(x);
      setIndicatorW(w);
    };

    const updateMenuIndicator = () => {
      const list = menuLinksRef.current;
      if (!list) return;
      const active = list.querySelector("a.active") as HTMLAnchorElement | null;
      if (!active) {
        setMenuIndicatorVisible(false);
        return;
      }
      setMenuIndicatorVisible(true);
      const rect = active.getBoundingClientRect();
      const panelRect = menuPanelRef.current?.getBoundingClientRect();
      if (!panelRect) return;
      const y = rect.top - panelRect.top;
      const h = rect.height;
      setMenuIndicatorY(y);
      setMenuIndicatorH(h);
    };

    const raf = requestAnimationFrame(() => {
      updateIndicator();
      updateMenuIndicator();
    });
    const handleResize = () => {
      updateIndicator();
      updateMenuIndicator();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeSection, i18n.language]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!className.includes("visible")) {
      const id = window.setTimeout(() => {
        setMenuOpen(false);
      }, 0);
      return () => window.clearTimeout(id);
    }
    return;
  }, [className]);

  const navLinks = [
    { href: "#projects", label: t("nav.projects") },
    { href: "#works", label: t("nav.works") },
    { href: "#about", label: t("nav.about") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <nav className={`navbar ${className}`}>
      <div className="container">
        <a href="#hero" className="navbar-brand" onClick={handleBrandClick}>
          MYSXAN
        </a>
        <div className="navbar-right">
          <button
            type="button"
            className={`navbar-menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg
                className="navbar-menu-icon"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                className="navbar-menu-icon"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          <ul className="navbar-links" ref={linksRef}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={activeSection === link.href.slice(1) ? "active" : ""}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <span
              className="nav-indicator"
              style={{
                transform: `translateX(${indicatorX}px)`,
                width: indicatorVisible ? `${indicatorW}px` : "0px",
                opacity: indicatorVisible ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </ul>
        </div>
      </div>
      <div
        id="primary-nav"
        className={`navbar-menu-panel ${menuOpen ? "open" : ""}`}
        ref={menuPanelRef}
      >
        <span
          className="navbar-menu-indicator"
          style={{
            transform: menuIndicatorVisible
              ? `translateY(${menuIndicatorY}px)`
              : `translateY(${menuIndicatorY - 10}px)`,
            height: `${menuIndicatorH}px`,
            width: "100%",
            opacity: menuIndicatorVisible ? 1 : 0,
          }}
          aria-hidden="true"
        />
        <div className="container">
          <ul className="navbar-menu-links" ref={menuLinksRef}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={activeSection === link.href.slice(1) ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="navbar-menu-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        />
      )}
    </nav>
  );
}
