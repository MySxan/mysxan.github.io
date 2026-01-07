// Works section component - showcases work experience and portfolio items
import { useState, useEffect, useRef } from "react";
import { Section } from "../ui/Section";
import { WorkCard } from "../ui/WorkCard";
import { Modal } from "../ui/Modal";
import type { Work } from "../../data/works";
import { works } from "../../data/works";

export function Works() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeColumn, setActiveColumn] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [dotCount, setDotCount] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const getColumnWidth = () => {
    const gap = 16;
    const pageWidth = window.innerWidth;
    const cardWidth = pageWidth / 5 - (gap * 4) / 5;
    return cardWidth + gap;
  };

  const getMaxDotIndex = () => (dotCount > 0 ? dotCount - 1 : 0);

  useEffect(() => {
    const layoutMasonry = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const items = Array.from(grid.children).filter(
        (child) => !child.classList.contains("works-spacer")
      ) as HTMLElement[];
      const gap = 16; // var(--space-2) = 2rem = 32px (same as container padding)

      // Get container width to calculate card width (1/5 of viewport)
      const pageWidth = window.innerWidth;
      const cardWidth = pageWidth / 5 - (gap * 4) / 5; // Account for gaps

      const cardsPerColumn = 2; // Max 2 cards per column
      const numColumns = Math.ceil(items.length / cardsPerColumn);
      const columnHeights = new Array(numColumns).fill(0);

      items.forEach((item, index) => {
        // Calculate which column this item belongs to
        const columnIndex = Math.floor(index / cardsPerColumn);

        // Position item
        item.style.position = "absolute";
        item.style.width = `${cardWidth}px`;
        item.style.left = `${columnIndex * (cardWidth + gap)}px`;
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
      const columnWidth = getColumnWidth();
      const visibleWidth = grid.clientWidth;
      // Calculate how many columns can actually fit in the visible width
      const computedVisibleColumns = Math.max(
        1,
        Math.floor(visibleWidth / columnWidth)
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
    };

    // Layout after images load and on resize
    const handleResize = () => {
      setTimeout(layoutMasonry, 100);
    };

    // Initial layout with delay to ensure images are measured
    setTimeout(layoutMasonry, 800);
    // Re-layout after images load
    setTimeout(layoutMasonry, 2000);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Native wheel listener to enforce per-card horizontal stepping across browsers
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const nativeWheel = (ev: WheelEvent) => {
      if (!gridRef.current) return;
      const delta =
        Math.abs(ev.deltaX) > Math.abs(ev.deltaY) ? ev.deltaX : ev.deltaY;
      if (delta === 0) return;
      ev.preventDefault();
      const dir = delta > 0 ? 1 : -1;
      const columnWidth = getColumnWidth();
      const scrollLeft = gridRef.current.scrollLeft;
      const baseIndex =
        dir > 0
          ? Math.floor(scrollLeft / columnWidth)
          : Math.ceil(scrollLeft / columnWidth);
      const newIndex = baseIndex + dir;
      const target = Math.min(Math.max(0, newIndex * columnWidth), maxScroll);
      gridRef.current.scrollTo({ left: target, behavior: "smooth" });
    };
    el.addEventListener("wheel", nativeWheel, { passive: false });
    return () => el.removeEventListener("wheel", nativeWheel);
  }, [maxScroll]);

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
        maxScroll
      );
      gridRef.current.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  const handleDotClick = (columnIndex: number) => {
    if (gridRef.current) {
      const columnWidth = getColumnWidth();
      const scrollAmount = Math.min(columnIndex * columnWidth, maxScroll);
      gridRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (gridRef.current) {
      const scrollLeft = gridRef.current.scrollLeft;
      // Hard clamp: do not allow scrolling beyond the last fully visible column
      if (scrollLeft > maxScroll) {
        gridRef.current.scrollTo({ left: maxScroll, behavior: "auto" });
      }
      setIsAtStart(scrollLeft === 0);

      // Calculate current column based on scroll position
      const columnWidth = getColumnWidth();
      const currentColumn = Math.floor(
        (scrollLeft + columnWidth / 2) / columnWidth
      );
      const maxDotIndex = getMaxDotIndex();
      setActiveColumn(Math.min(currentColumn, maxDotIndex));
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const grid = gridRef.current;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    e.preventDefault();

    const dir = delta > 0 ? 1 : -1;
    const columnWidth = getColumnWidth();
    const scrollLeft = grid.scrollLeft;
    const baseIndex =
      dir > 0
        ? Math.floor(scrollLeft / columnWidth)
        : Math.ceil(scrollLeft / columnWidth);
    const newIndex = baseIndex + dir;
    const target = Math.min(Math.max(0, newIndex * columnWidth), maxScroll);
    grid.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <>
      <Section id="works" title="" className="works-section">
        {/* Main layout with vertical title and grid */}
        <div className="works-layout">
          <h2 className="works-title-vertical">Works</h2>

          <div className="works-container">
            <div className="works-grid-wrapper">
              <div
                ref={gridRef}
                className="works-grid"
                onScroll={handleScroll}
                onWheel={handleWheel}
              >
                {works.map((work, index) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    index={index}
                    onClick={() => setSelectedWork(work)}
                  />
                ))}
                {/* Spacer to ensure right-side blank area exists when at last column */}
                <div className="works-spacer" aria-hidden="true" />
              </div>

              {/* Right edge gradient mask and animated triangle */}
              <div className="works-edge-mask" />
              <div
                className={`works-triangle ${isAtStart ? "visible" : "hidden"}`}
              >
                ▶
              </div>
            </div>

            {/* Navigation bar */}
            <div className="works-nav">
              <button
                className="works-nav-btn works-nav-btn-left"
                onClick={handleScrollLeft}
                aria-label="Scroll left"
              >
                ◀
              </button>
              <div className="works-nav-dots">
                {Array.from({ length: dotCount }).map((_, i) => (
                  <button
                    key={i}
                    className={`works-nav-dot ${
                      i === activeColumn ? "active" : ""
                    }`}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Go to column ${i + 1}`}
                  />
                ))}
              </div>
              <button
                className="works-nav-btn works-nav-btn-right"
                onClick={handleScrollRight}
                aria-label="Scroll right"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </Section>

      {selectedWork && (
        <Modal
          isOpen={!!selectedWork}
          onClose={() => setSelectedWork(null)}
          title={selectedWork.title}
          externalLink={{
            url: selectedWork.url,
            label: "View Full Project",
          }}
        >
          <img
            src={selectedWork.thumbnail}
            alt={selectedWork.title}
            className="modal-image"
          />
          <div className="modal-details">
            <p>
              <strong>Type:</strong> {selectedWork.type}
            </p>
            <p>
              <strong>Year:</strong> {selectedWork.year}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
