// Navbar component - responsive navigation with smooth scroll and active section highlighting
import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("hero");
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorW, setIndicatorW] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const linksRef = useRef<HTMLUListElement>(null);

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

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeSection]);

  const navLinks = [
    { href: "#projects", label: "Projects" },
    { href: "#works", label: "Works" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className={`navbar ${className}`}>
      <div className="container">
        <a href="#hero" className="navbar-brand" onClick={handleBrandClick}>
          MYSXAN
        </a>
        <div className="navbar-right">
          <ul className="navbar-links" ref={linksRef}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={
                    activeSection === link.href.slice(1) ? "active" : ""
                  }
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
    </nav>
  );
}
