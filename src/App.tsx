// Main App component - single-page personal website with anchor sections
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { IntroStage } from "./components/layout/IntroStage";
import { Info } from "./components/home/Info";
import { Projects } from "./components/home/Projects";
import { Works } from "./components/home/Works";
import { About } from "./components/home/About";
import { Contact } from "./components/home/Contact";
import { useTheme } from "./hooks/useTheme";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import "./styles/globals.css";
import "./styles/main.css";
import "./styles/intro.css";
import "./styles/info.css";

function App() {
  const [navVisible, setNavVisible] = useState(false);

  // Initialize theme
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const langAnimTimer = useRef<number | null>(null);
  const isZh = i18n.language.startsWith("zh");
  const currentLangLabel = isZh ? "ZH" : "EN";
  const nextLangLabel = isZh ? "EN" : "ZH";
  const triggerLangAnimation = () => {
    const root = document.documentElement;
    root.classList.remove("lang-change");
    void root.offsetHeight;
    root.classList.add("lang-change");
    if (langAnimTimer.current) {
      window.clearTimeout(langAnimTimer.current);
    }
    langAnimTimer.current = window.setTimeout(() => {
      root.classList.remove("lang-change");
      langAnimTimer.current = null;
    }, 500);
  };
  const toggleLang = () => {
    triggerLangAnimation();
    i18n.changeLanguage(isZh ? "en" : "zh");
  };
  const [footerInView, setFooterInView] = useState(false);

  // Observe footer visibility to hide toggles when footer is on screen
  useEffect(() => {
    const footerEl = document.querySelector<HTMLElement>("footer.footer");
    if (!footerEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setFooterInView(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("page-enter");
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove("page-enter");
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove("page-enter");
    };
  }, []);

  useEffect(() => {
    return () => {
      if (langAnimTimer.current) {
        window.clearTimeout(langAnimTimer.current);
        langAnimTimer.current = null;
      }
    };
  }, []);

  return (
    <>
      <Navbar className={navVisible ? "visible" : ""} />

      {/* Toggle Rail - bottom right, unified style with separator */}
      <div
        className={`toggle-rail ${
          navVisible && !footerInView ? "visible" : ""
        }`}
        aria-label={t("app.quickToggles")}
      >
        <button
          className="toggle-btn theme-toggle"
          onClick={toggleTheme}
          aria-label={t("app.switchTheme", {
            mode: t(`mode.${theme === "light" ? "dark" : "light"}`),
          })}
          title={t("app.switchTheme", {
            mode: t(`mode.${theme === "light" ? "dark" : "light"}`),
          })}
        >
          {theme === "light" ? <BsMoonFill /> : <BsSunFill />}
        </button>
        <span className="toggle-separator" aria-hidden="true" />
        <button
          className="toggle-btn lang-toggle"
          onClick={toggleLang}
          aria-label={t("app.switchLanguage", { lang: nextLangLabel })}
          title={t("app.switchLanguage", { lang: nextLangLabel })}
        >
          {currentLangLabel}
        </button>
      </div>

      {/* Fixed Background at the very bottom */}
      <div className="page-background">
        <img
          src={`${import.meta.env.BASE_URL}img/background.png`}
          alt="Background"
        />
        <div className="background-overlay" />
      </div>

      <main>
        <IntroStage onScrollComplete={setNavVisible}>
          <Info />
          <Projects />
          <Works />
          <About />
          <Contact />
        </IntroStage>
      </main>
      <Footer />
    </>
  );
}

export default App;
