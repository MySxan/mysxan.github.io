// Works section component - showcases work experience and portfolio items
import { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "../ui/Section";
import { WorkCard } from "../ui/WorkCard";
import { Modal } from "../ui/Modal";
import type { Work } from "../../data/works";
import { works } from "../../data/works";

export function Works() {
  const { t } = useTranslation();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [activeColumn, setActiveColumn] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [dotCount, setDotCount] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollRafRef = useRef<number | null>(null);
  const restoredRef = useRef(false);
  const parallaxConfigs = useMemo(
    () => [
      { range: 35, speed: 1.2, aspectRatio: "3/4", imageHeight: 160 },
      { range: 40, speed: 0.9, aspectRatio: "16/9", imageHeight: 150 },
      { range: 30, speed: 1.4, aspectRatio: "1/1", imageHeight: 145 },
      { range: 38, speed: 1.0, aspectRatio: "4/3", imageHeight: 155 },
      { range: 32, speed: 1.3, aspectRatio: "5/4", imageHeight: 148 },
      { range: 42, speed: 0.8, aspectRatio: "21/9", imageHeight: 165 },
    ],
    [],
  );
  const parallaxMap = useMemo(
    () =>
      works.map((_, index) => parallaxConfigs[index % parallaxConfigs.length]),
    [parallaxConfigs],
  );

  const getLayoutMetrics = () => {
    const pageWidth = window.innerWidth;
    let gap = 16;
    let cardWidth = pageWidth / 5 - (gap * 4) / 5;

    if (pageWidth <= 900) {
      const columns = 3;
      cardWidth = pageWidth / columns - (gap * (columns - 1)) / columns;
    }

    if (pageWidth <= 768) {
      gap = 14;
      cardWidth = Math.min(420, Math.round((pageWidth - gap) / 1.5));
    }

    if (pageWidth <= 640) {
      gap = 12;
      cardWidth = Math.min(380, Math.round((pageWidth - gap) / 1.5));
    }

    cardWidth = Math.max(220, cardWidth);
    return { gap, cardWidth, columnWidth: cardWidth + gap };
  };

  const getColumnWidth = () => getLayoutMetrics().columnWidth;

  const getMaxDotIndex = () => (dotCount > 0 ? dotCount - 1 : 0);

  useEffect(() => {
    const layoutMasonry = (grid: HTMLDivElement) => {
      const items = Array.from(grid.children).filter(
        (child) => !child.classList.contains("works-spacer"),
      ) as HTMLElement[];
      const { gap, cardWidth, columnWidth } = getLayoutMetrics();

      const cardsPerColumn = 2; // Max 2 cards per column
      const numColumns = Math.ceil(items.length / cardsPerColumn);
      const columnHeights = new Array(numColumns).fill(0);

      items.forEach((item, index) => {
        // Calculate which column this item belongs to
        const columnIndex = Math.floor(index / cardsPerColumn);

        // Position item
        item.style.position = "absolute";
        item.style.width = `${cardWidth}px`;
        item.style.left = `${columnIndex * columnWidth}px`;
        item.style.top = `${
          (index % cardsPerColumn) *
          (columnHeights[columnIndex] > 0 ? columnHeights[columnIndex] : 0)
        }px`;

        // Update column height after positioning
        if (index % cardsPerColumn === 0) {
          columnHeights[columnIndex] = item.offsetHeight + gap;
        } else {
          columnHeights[columnIndex] += item.offsetHeight + gap;
          item.style.top = `${
            columnHeights[columnIndex] - item.offsetHeight - gap
          }px`;
        }
      });

      // Set grid height only - width will be controlled by CSS
      const maxHeight = Math.max(...columnHeights);
      grid.style.height = `${maxHeight}px`;

      // Compute scrolling metrics - dynamically calculate visible columns
      const visibleWidth = grid.clientWidth;
      // Calculate how many columns can actually fit in the visible width
      const computedVisibleColumns = Math.max(
        1,
        Math.floor(visibleWidth / columnWidth),
      );

      // Add an end spacer so when at the last column, the right side shows blank space
      const endSpacer = Math.max(0, visibleWidth - columnWidth);
      // Set CSS var for scroll padding
      grid.style.setProperty("--works-end-spacer", `${endSpacer}px`);
      // Allowed steps: totalColumns - visibleColumns
      const allowedMaxIndex = Math.max(0, numColumns - computedVisibleColumns);
      // Dots should represent positions: start (0) plus each step → total = allowedMaxIndex + 1
      const newDotCount = allowedMaxIndex + 1;
      const maxScrollValue = allowedMaxIndex * columnWidth;

      setMaxScroll(maxScrollValue);
      setDotCount(newDotCount);

      // Position a spacer element at the end to extend scrollWidth
      const spacer = grid.querySelector(".works-spacer") as HTMLElement | null;
      if (spacer) {
        spacer.style.position = "absolute";
        spacer.style.left = `${numColumns * columnWidth}px`;
        spacer.style.width = `${endSpacer}px`;
        spacer.style.height = "1px";
      }

      // Clamp active dot if needed
      const maxDotIndex = Math.max(0, newDotCount - 1);
      setActiveColumn((prev) => Math.min(prev, maxDotIndex));
      if (!restoredRef.current) {
        const savedScroll = Number(
          window.sessionStorage.getItem("works-scroll") ?? 0,
        );
        const savedColumn = Number(
          window.sessionStorage.getItem("works-column") ?? 0,
        );
        const targetScroll = Math.min(savedScroll, maxScrollValue);
        grid.scrollLeft = targetScroll;
        const computedColumn = Math.floor(
          (targetScroll + columnWidth / 2) / columnWidth,
        );
        setActiveColumn(Math.min(savedColumn || computedColumn, maxDotIndex));
        restoredRef.current = true;
      }
    };

    // Layout after images load and on resize
    const handleResize = () => {
      if (!gridRef.current) return;
      requestAnimationFrame(() =>
        layoutMasonry(gridRef.current as HTMLDivElement),
      );
    };

    if (gridRef.current) {
      requestAnimationFrame(() =>
        layoutMasonry(gridRef.current as HTMLDivElement),
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    let isActive = false;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const resetParallax = () => {
      imageRefs.current.forEach((image) => {
        if (image) {
          image.style.transform = "";
        }
      });
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;
        parallaxMap.forEach((config, index) => {
          const card = cardRefs.current[index];
          const image = imageRefs.current[index];
          if (!card || !image) return;
          const rect = card.getBoundingClientRect();
          if (rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress =
              (windowHeight - rect.top) / (windowHeight + rect.height);
            const startPos = -config.range;
            const translateY =
              startPos + scrollProgress * config.range * config.speed;
            image.style.transform = `translateY(${translateY}%)`;
          }
        });
        ticking = false;
      });
    };

    const setActive = (nextActive: boolean) => {
      if (nextActive === isActive) return;
      isActive = nextActive;
      if (isActive) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        handleScroll();
      } else {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      }
    };

    if (prefersReducedMotion.matches) {
      resetParallax();
      return () => {
        resetParallax();
      };
    }

    const target = gridRef.current;
    if (!target) {
      setActive(true);
      return () => {
        setActive(false);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setActive(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(target);
    return () => {
      setActive(false);
      observer.disconnect();
    };
  }, [parallaxMap]);

  const handleScrollLeft = () => {
    if (gridRef.current) {
      const columnWidth = getColumnWidth();
      gridRef.current.scrollBy({ left: -columnWidth, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (gridRef.current) {
      const columnWidth = getColumnWidth();
      const target = Math.min(
        gridRef.current.scrollLeft + columnWidth,
        maxScroll,
      );
      gridRef.current.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  const handleDotClick = (columnIndex: number) => {
    if (gridRef.current) {
      const columnWidth = getColumnWidth();
      const scrollAmount = Math.min(columnIndex * columnWidth, maxScroll);
      gridRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
      window.sessionStorage.setItem("works-column", String(columnIndex));
      window.sessionStorage.setItem("works-scroll", String(scrollAmount));
    }
  };

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - gridRef.current.offsetLeft;
    scrollLeft.current = gridRef.current.scrollLeft;
    gridRef.current.style.scrollBehavior = "auto";
    // Disable snap during drag for smooth scrolling
    gridRef.current.style.scrollSnapType = "none";
  };

  const handleMouseLeave = () => {
    if (!gridRef.current) return;
    isDragging.current = false;
    gridRef.current.style.scrollBehavior = "smooth";
    // Re-enable snap after drag
    gridRef.current.style.scrollSnapType = "x mandatory";
  };

  const handleMouseUp = () => {
    if (!gridRef.current) return;
    isDragging.current = false;
    gridRef.current.style.scrollBehavior = "smooth";
    // Re-enable snap after drag
    gridRef.current.style.scrollSnapType = "x mandatory";
    // Reset hasDragged after a short delay to allow click handlers to check it
    setTimeout(() => {
      hasDragged.current = false;
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !gridRef.current) return;
    e.preventDefault();
    const x = e.pageX - gridRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    // Mark as dragged if moved more than 5px
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }

    gridRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleCardClick = (work: Work) => {
    // Prevent click if user was dragging
    if (!hasDragged.current) {
      setSelectedWork(work);
    }
  };

  const handleScroll = () => {
    if (gridRef.current) {
      const scrollLeft = gridRef.current.scrollLeft;
      setIsAtStart(scrollLeft === 0);

      // Calculate current column based on scroll position
      const columnWidth = getColumnWidth();
      const currentColumn = Math.floor(
        (scrollLeft + columnWidth / 2) / columnWidth,
      );
      const maxDotIndex = getMaxDotIndex();
      setActiveColumn(Math.min(currentColumn, maxDotIndex));

      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
      scrollRafRef.current = window.requestAnimationFrame(() => {
        window.sessionStorage.setItem("works-scroll", String(scrollLeft));
        window.sessionStorage.setItem(
          "works-column",
          String(Math.min(currentColumn, maxDotIndex)),
        );
      });

      // Debounce the scroll limiting to avoid interrupting momentum
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        if (gridRef.current && gridRef.current.scrollLeft > maxScroll) {
          gridRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
        }
      }, 150);
    }
  };

  const handleWheel = () => {
    // Let browser handle both vertical (page) and horizontal (grid) scrolling naturally
  };

  // Cleanup any pending timers/RAF on unmount to avoid lingering callbacks
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Section id="works" title="" className="works-section">
        {/* Main layout with vertical title and grid */}
        <div className="works-layout">
          <h2 className="works-title-vertical">{t("works.title")}</h2>

          <div className="works-container">
            <div className="works-grid-wrapper">
              <div
                ref={gridRef}
                className="works-grid"
                onScroll={handleScroll}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {works.map((work, index) => {
                  const config = parallaxMap[index];
                  return (
                    <WorkCard
                      key={work.id}
                      work={work}
                      aspectRatio={config.aspectRatio}
                      imageHeight={config.imageHeight}
                      setCardRef={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      setImageRef={(el) => {
                        imageRefs.current[index] = el;
                      }}
                      onClick={() => handleCardClick(work)}
                    />
                  );
                })}
                {/* Spacer to ensure right-side blank area exists when at last column */}
                <div className="works-spacer" aria-hidden="true" />
              </div>

              {/* Right edge gradient mask and animated triangle */}
              <div className="works-edge-mask" />
              <div
                className={`works-triangle ${isAtStart ? "visible" : "hidden"}`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="works-nav">
          <button
            className="works-nav-btn works-nav-btn-left"
            onClick={handleScrollLeft}
            aria-label={t("works.nav.scrollLeft")}
          />
          <div className="works-nav-dots">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                className={`works-nav-dot ${
                  i === activeColumn ? "active" : ""
                }`}
                onClick={() => handleDotClick(i)}
                aria-label={t("works.nav.goToColumn", { index: i + 1 })}
              />
            ))}
          </div>
          <button
            className="works-nav-btn works-nav-btn-right"
            onClick={handleScrollRight}
            aria-label={t("works.nav.scrollRight")}
          />
        </div>
      </Section>

      {selectedWork && (
        <Modal
          isOpen={!!selectedWork}
          onClose={() => setSelectedWork(null)}
          title={selectedWork.title}
          externalLink={{
            url: selectedWork.url,
            label: t("works.modal.viewFullProject"),
          }}
        >
          <img
            src={selectedWork.thumbnail}
            alt={selectedWork.title}
            className="modal-image"
          />
          <div className="modal-details">
            <p>
              <strong>{t("works.modal.type")}:</strong> {selectedWork.type}
            </p>
            <p>
              <strong>{t("works.modal.year")}:</strong> {selectedWork.year}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
