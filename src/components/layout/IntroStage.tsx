// IntroStage - handles the scroll narrative (Phase A/B)
import { useEffect, useState, useRef, type ReactNode } from "react";
import { Hero } from "../home/Hero";

interface IntroStageProps {
  onScrollComplete: (completed: boolean) => void;
  children: ReactNode;
}

// Get Lenis instance from global window
interface LenisInstance {
  scrollTo: (
    target: number,
    options?: { duration?: number; lock?: boolean }
  ) => void;
}

declare global {
  interface Window {
    __lenis?: LenisInstance;
  }
}

export function IntroStage({ onScrollComplete, children }: IntroStageProps) {
  const [cover, setCover] = useState(0);
  const [titleTransform, setTitleTransform] = useState(0);
  const [heroIn, setHeroIn] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isLockedAtTop = useRef(false);
  const lastLockTime = useRef(0);

  // Reset to top on component mount (only if user hasn't scrolled yet)
  useEffect(() => {
    if (window.scrollY === 0) {
      return; // Already at top
    }
    // Optionally reset: uncomment if needed
    // requestAnimationFrame(() => {
    //   window.scrollTo(0, 0);
    // });
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!stageRef.current || !contentRef.current) return;

          const rect = stageRef.current.getBoundingClientRect();
          const contentRect = contentRef.current.getBoundingClientRect();
          const stageHeight = stageRef.current.offsetHeight;
          const windowHeight = window.innerHeight;

          // Calculate scroll progress through IntroStage
          const progress = Math.max(
            0,
            Math.min(1, -rect.top / (stageHeight - windowHeight))
          );

          // Cover mapping: starts at 10%, completes at 55%
          const coverStart = 0.1;
          const coverEnd = 0.55;
          const newCover = Math.max(
            0,
            Math.min(1, (progress - coverStart) / (coverEnd - coverStart))
          );

          setCover(newCover);

          // Show navbar only when white content reaches the top
          const shouldShowNav = contentRect.top <= 0;
          onScrollComplete(shouldShowNav);

          // Show hero title animation: either at page top initially or when white content reaches top
          if (!heroIn && (window.scrollY < 100 || contentRect.top <= 0)) {
            setHeroIn(true);
          }

          // Stick title to white content when it reaches top
          const isStuck = contentRect.top <= 0;

          // Calculate title transform when stuck
          if (isStuck) {
            // Title should follow the white content - use contentRect.top directly
            setTitleTransform(contentRect.top);
          } else {
            setTitleTransform(0);
          }

          // Check if white content is at top position
          if (contentRect.top >= -5 && contentRect.top <= 5) {
            isLockedAtTop.current = true;
          } else if (contentRect.top > 50) {
            // Reset lock when scrolled away
            isLockedAtTop.current = false;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    const handleWheelCapture = (e: WheelEvent) => {
      const now = performance.now();
      const LOCK_COOLDOWN = 500;

      const contentEl = contentRef.current;
      if (!contentEl) return;

      const contentRect = contentEl.getBoundingClientRect();
      const scrollY = window.scrollY;

      // If locked and in cooldown, prevent further wheel handling
      if (isLockedAtTop.current && now - lastLockTime.current < LOCK_COOLDOWN) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      // Scrolling down: snap to white content top
      if (e.deltaY > 0 && contentRect.top > 10) {
        const targetScroll = scrollY + contentRect.top;

        e.preventDefault();
        e.stopImmediatePropagation(); // Block Lenis from handling this wheel event

        const lenis = window.__lenis;
        if (lenis) {
          lenis.scrollTo(targetScroll, {
            duration: 1.5,
            lock: true,
          });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }

        isLockedAtTop.current = true;
        lastLockTime.current = now;
        return;
      }

      // Scrolling up: jump back to hero
      if (e.deltaY < 0 && contentRect.top > 10) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const lenis = window.__lenis;
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.5, lock: true });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        isLockedAtTop.current = false;
        lastLockTime.current = 0;
        return;
      }

      // Other cases: let Lenis handle normally
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheelCapture, {
      capture: true,
      passive: false,
    });

    // Use requestAnimationFrame to ensure DOM is fully rendered before calculating initial position
    requestAnimationFrame(() => {
      handleScroll(); // Initial call - this will set heroIn and titleTransform correctly
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheelCapture, {
        capture: true,
      } as unknown as EventListenerOptions);
    };
  }, [onScrollComplete, heroIn]);

  return (
    <div
      ref={stageRef}
      className={`intro-stage ${heroIn ? "hero-in" : ""}`}
      style={
        {
          "--cover": cover,
          "--hero-opacity": Math.max(0, 1 - cover * 1.2),
          "--hero-translateY": `${-cover * 48}px`,
        } as React.CSSProperties
      }
    >
      {/* Title Layer - fixed at top */}
      <div
        className="title-layer"
        style={{ transform: `translateY(${titleTransform}px)` }}
      >
        <h1 className="site-title" aria-label="MYSXAN">
          {Array.from("MYSXAN").map((ch, idx) => (
            <span
              className="letter"
              style={
                { "--delay": `${0.6 + idx * 0.06}s` } as React.CSSProperties
              }
              key={idx}
            >
              <span>{ch}</span>
            </span>
          ))}
        </h1>
        <p className="site-subtitle">Developer & Designer</p>
      </div>

      {/* Hero Section - absolute positioned at top */}
      <div className="intro-hero-section">
        <div className="hero-overlay">
          <Hero />
        </div>
      </div>

      {/* Spacer to create scroll space */}
      <div className="intro-spacer" />

      {/* Content Section - normal flow */}
      <div ref={contentRef} className="intro-content">
        {children}
      </div>
    </div>
  );
}
