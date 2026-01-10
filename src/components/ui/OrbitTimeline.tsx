import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { OrbitMilestone, OrbitDomain } from "../../data/timeline";

const RING_GAP = 35;

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const EDGE_PADDING = 20;
const BOTTOM_PADDING = 28;
const YEAR_RING_OFFSET = 40;
const MONTH_RING_OFFSET = 80;
const INDICATOR_RING_OFFSET = 140;
const EXTRA_LABEL_PADDING = 40;
const MIN_HEIGHT = 260;

const toRad = (deg: number) => (Math.PI / 180) * deg;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const getArcAngles = (span: number) => ({
  startAngle: 180 + (180 - span) / 2,
  endAngle: 360 - (180 - span) / 2,
});
const polarPoint = (
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
) => ({
  x: centerX + radius * Math.cos(toRad(angle)),
  y: centerY + radius * Math.sin(toRad(angle)),
});

interface OrbitTimelineProps {
  milestones: OrbitMilestone[];
}

export function OrbitTimeline({ milestones }: OrbitTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeId, setActiveId] = useState(milestones[0]?.id ?? 0);
  const [previousId, setPreviousId] = useState<number | null>(null);
  const [hoverDomain, setHoverDomain] = useState<OrbitDomain | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const hasEnteredRef = useRef(false);
  const [arcSpan, setArcSpan] = useState(180);
  const [renderRotation, setRenderRotation] = useState(0);
  const rotationRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [renderIndicatorAngle, setRenderIndicatorAngle] = useState(0);
  const indicatorRef = useRef(0);
  const indicatorAnimationRef = useRef<number | null>(null);
  const [renderYearOffset, setRenderYearOffset] = useState(0);
  const yearOffsetRef = useRef(0);
  const yearAnimationRef = useRef<number | null>(null);
  const prevYearStartRef = useRef<number | null>(null);
  const [yearReady, setYearReady] = useState(false);
  const [displayYearSegment, setDisplayYearSegment] = useState<
    typeof activeYearSegment | null
  >(null);
  const scale = useMemo(() => {
    if (!size.width) return 1;
    const min = 0.82;
    const max = 1;
    const t = clamp((size.width - 770) / (1350 - 770), 0, 1);
    return min + (max - min) * t;
  }, [size.width]);
  const detailTopValue = useMemo(() => {
    const minScale = 0.82;
    const maxScale = 1;
    const minTop = 70;
    const maxTop = 50;
    const t = clamp((scale - minScale) / (maxScale - minScale), 0, 1);
    return minTop + (maxTop - minTop) * t;
  }, [scale]);
  const detailTop = `${detailTopValue}%`;
  const yearRingOffset = YEAR_RING_OFFSET * scale;
  const monthRingOffset = MONTH_RING_OFFSET * scale;
  const indicatorRingOffset = INDICATOR_RING_OFFSET * scale;
  const geometry = useMemo(() => {
    if (!size.width || !size.height) return null;
    const centerX = size.width / 2;
    const centerY = size.height - BOTTOM_PADDING;
    const spanRad = toRad(arcSpan);
    const chord = Math.max(0, size.width - EDGE_PADDING * 2);
    const baseRadius = Math.max(
      0,
      chord / (2 * Math.sin(spanRad / 2)) - indicatorRingOffset
    );
    const outerRadius = baseRadius * scale;
    const ringGap = RING_GAP * scale;
    const innerRadius = Math.max(0, outerRadius - ringGap * 2);
    const { startAngle, endAngle } = getArcAngles(arcSpan);
    return {
      centerX,
      centerY,
      outerRadius,
      ringGap,
      innerRadius,
      yearRadius: outerRadius + yearRingOffset,
      monthRadius: outerRadius + monthRingOffset,
      indicatorRadius: outerRadius + indicatorRingOffset,
      startAngle,
      endAngle,
    };
  }, [
    arcSpan,
    indicatorRingOffset,
    monthRingOffset,
    scale,
    size.height,
    size.width,
    yearRingOffset,
  ]);
  const maskStops = useMemo(() => {
    if (!geometry) {
      return { start: "70%", end: "85%" };
    }
    const endRad = toRad(geometry.endAngle);
    const maskStartPx =
      geometry.centerY + geometry.innerRadius * Math.sin(endRad);
    const fade = 70 * scale;
    const maskEndPx = Math.min(size.height, maskStartPx + fade);
    return { start: `${maskStartPx}px`, end: `${maskEndPx}px` };
  }, [geometry, scale, size.height]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const span = 180 - Math.min(40, Math.max(0, ((width - 720) / 720) * 40));
      const spanRad = toRad(span);
      const chord = Math.max(0, width - EDGE_PADDING * 2);
      const radius = chord / (2 * Math.sin(spanRad / 2)) - indicatorRingOffset;
      const radiusWithIndicator = Math.max(0, radius + indicatorRingOffset);
      const height = Math.max(
        MIN_HEIGHT,
        Math.round(radiusWithIndicator + EXTRA_LABEL_PADDING + BOTTOM_PADDING)
      );
      setArcSpan(span);
      setSize({ width, height });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [indicatorRingOffset]);

  useEffect(() => {
    const element = orbitRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          if (!hasEnteredRef.current) {
            hasEnteredRef.current = true;
            window.setTimeout(() => setHasEntered(true), 620);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const active =
    milestones.find((item) => item.id === activeId) ?? milestones[0];
  const previous =
    previousId != null
      ? milestones.find((item) => item.id === previousId) ?? null
      : null;

  const orbitData = useMemo(() => {
    if (!geometry) return [];
    const { centerX, centerY } = geometry;
    const ringRadiusMap: Record<OrbitDomain, number> = {
      frontend: geometry.outerRadius,
      design: Math.max(0, geometry.outerRadius - geometry.ringGap),
      music: Math.max(0, geometry.outerRadius - geometry.ringGap * 2),
    };
    const monthStep = (geometry.endAngle - geometry.startAngle) / 12;
    const years = Array.from(new Set(milestones.map((item) => item.year))).sort(
      (a, b) => a - b
    );
    const yearStep = years.length
      ? (geometry.endAngle - geometry.startAngle) / years.length
      : 0;
    const yearIndexMap = new Map(years.map((year, index) => [year, index]));

    return milestones.map((item, index) => {
      const monthIndex = Math.min(11, Math.max(0, item.month - 1));
      const radius = ringRadiusMap[item.domain];
      const yearIndex = yearIndexMap.get(item.year) ?? 0;
      const dayProgress = Math.min(1, Math.max(0, (item.day - 1) / 30));
      const yearProgress = (monthIndex + dayProgress) / 12;
      const angle = geometry.startAngle + (yearIndex + yearProgress) * yearStep;
      const point = polarPoint(centerX, centerY, radius, angle);
      const monthAngle =
        geometry.startAngle + (monthIndex + dayProgress) * monthStep;
      return {
        ...item,
        x: point.x,
        y: point.y,
        radius,
        centerX,
        centerY,
        index,
        angle,
        startAngle: geometry.startAngle,
        monthAngle,
        monthLabel: MONTHS[monthIndex] ?? "JAN",
      };
    });
  }, [geometry, milestones]);

  const rings = useMemo(() => {
    if (!geometry) return [];
    return [
      { domain: "frontend" as const, radius: geometry.outerRadius },
      {
        domain: "design" as const,
        radius: Math.max(0, geometry.outerRadius - geometry.ringGap),
      },
      {
        domain: "music" as const,
        radius: Math.max(0, geometry.outerRadius - geometry.ringGap * 2),
      },
    ].map((ring) => ({
      ...ring,
      centerX: geometry.centerX,
      centerY: geometry.centerY,
    }));
  }, [geometry]);

  const ticks = useMemo(() => {
    if (!geometry)
      return {
        months: [],
        monthBoundaries: [],
        monthSubTicks: [],
        yearTicks: [],
        yearLabels: [],
        yearRadius: 0,
        monthRadius: 0,
        indicatorRadius: 0,
        startAngle: 180,
        endAngle: 360,
        yearSegments: [],
      };
    const {
      centerX,
      centerY,
      yearRadius,
      monthRadius,
      startAngle,
      endAngle,
      indicatorRadius,
    } = geometry;
    const years = Array.from(new Set(milestones.map((item) => item.year))).sort(
      (a, b) => a - b
    );
    const yearStep = years.length ? (endAngle - startAngle) / years.length : 0;
    const yearTicks = Array.from({ length: years.length + 1 }, (_, index) => ({
      angle: startAngle + index * yearStep,
      centerX,
      centerY,
      outerRadius: yearRadius,
    }));
    const yearLabels = years.map((year, index) => ({
      year,
      angle: startAngle + (index + 0.5) * yearStep,
      centerX,
      centerY,
      outerRadius: yearRadius,
    }));
    const yearSegments = years.map((year, index) => ({
      year,
      startAngle: startAngle + index * yearStep,
      endAngle: startAngle + (index + 1) * yearStep,
      centerX,
      centerY,
      radius: yearRadius,
    }));
    const monthStep = (endAngle - startAngle) / 12;
    const monthsData = MONTHS.map((label, index) => ({
      label,
      angle: startAngle + (index + 0.5) * monthStep,
      centerX,
      centerY,
      outerRadius: monthRadius,
    }));
    const monthBoundaries = Array.from({ length: 13 }, (_, index) => ({
      angle: startAngle + index * monthStep,
      centerX,
      centerY,
      outerRadius: monthRadius,
    }));
    const monthSubTicks = Array.from({ length: 12 }, (_, index) => {
      const base = startAngle + index * monthStep;
      return [1, 2, 3].map((step) => ({
        angle: base + (monthStep * step) / 4,
        centerX,
        centerY,
        outerRadius: monthRadius,
      }));
    }).flat();
    return {
      yearTicks,
      yearLabels,
      yearSegments,
      months: monthsData,
      monthBoundaries,
      monthSubTicks,
      yearRadius,
      monthRadius,
      indicatorRadius,
      startAngle,
      endAngle,
    };
  }, [geometry, milestones]);

  useEffect(() => {
    if (previousId == null) return;
    const timeout = window.setTimeout(() => setPreviousId(null), 220);
    return () => window.clearTimeout(timeout);
  }, [previousId]);

  const handleSelect = (id: number) => {
    if (id === activeId) return;
    setPreviousId(activeId);
    setActiveId(id);
  };

  const activeOrbit =
    orbitData.find((item) => item.id === activeId) ?? orbitData[0];
  const hoveredOrbit = orbitData.find((item) => item.id === hoveredId) ?? null;
  const activeYearSegment = ticks.yearSegments.find(
    (segment) => segment.year === activeOrbit?.year
  );
  const monthRotation =
    activeOrbit != null ? activeOrbit.angle - activeOrbit.monthAngle : 0;
  useEffect(() => {
    if (animationRef.current != null) {
      window.cancelAnimationFrame(animationRef.current);
    }
    const start = rotationRef.current;
    const end = monthRotation;
    const duration = 320;
    const startTime = window.performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const value = start + (end - start) * easeOutCubic(t);
      rotationRef.current = value;
      setRenderRotation(value);
      if (t < 1) {
        animationRef.current = window.requestAnimationFrame(step);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = window.requestAnimationFrame(step);
    return () => {
      if (animationRef.current != null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [monthRotation]);
  const wrapAngle = useCallback(
    (angle: number) => {
      const span = ticks.endAngle - ticks.startAngle;
      let adjusted = angle;
      while (adjusted < ticks.startAngle) adjusted += span;
      while (adjusted > ticks.endAngle) adjusted -= span;
      return adjusted;
    },
    [ticks.endAngle, ticks.startAngle]
  );

  useEffect(() => {
    if (!activeOrbit || !size.width || !size.height) return;
    const span = ticks.endAngle - ticks.startAngle;
    if (!span) {
      indicatorRef.current = activeOrbit.angle;
      window.requestAnimationFrame(() => {
        setRenderIndicatorAngle(activeOrbit.angle);
      });
      return;
    }
    if (indicatorAnimationRef.current != null) {
      window.cancelAnimationFrame(indicatorAnimationRef.current);
    }
    const start = indicatorRef.current || activeOrbit.angle;
    let end = activeOrbit.angle;
    const delta = end - start;
    if (Math.abs(delta) > span / 2) {
      end = delta > 0 ? end - span : end + span;
    }
    const duration = 360;
    const startTime = window.performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const value = start + (end - start) * easeOutCubic(t);
      indicatorRef.current = value;
      setRenderIndicatorAngle(wrapAngle(value));
      if (t < 1) {
        indicatorAnimationRef.current = window.requestAnimationFrame(step);
      } else {
        indicatorAnimationRef.current = null;
      }
    };

    indicatorAnimationRef.current = window.requestAnimationFrame(step);
    return () => {
      if (indicatorAnimationRef.current != null) {
        window.cancelAnimationFrame(indicatorAnimationRef.current);
      }
    };
  }, [
    activeOrbit,
    size.height,
    size.width,
    ticks.endAngle,
    ticks.startAngle,
    wrapAngle,
  ]);

  useEffect(() => {
    if (!activeYearSegment || !size.width || !size.height) return;
    if (yearAnimationRef.current != null) {
      window.cancelAnimationFrame(yearAnimationRef.current);
    }
    const prevStart = prevYearStartRef.current ?? activeYearSegment.startAngle;
    const currentStart = activeYearSegment.startAngle;
    const initialOffset = prevStart - currentStart;
    prevYearStartRef.current = currentStart;
    yearOffsetRef.current = initialOffset;

    const duration = 360;
    const startTime = window.performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const value = initialOffset * (1 - easeOutCubic(t));
      yearOffsetRef.current = value;
      setRenderYearOffset(value);
      if (t < 1) {
        yearAnimationRef.current = window.requestAnimationFrame(step);
      } else {
        yearAnimationRef.current = null;
      }
    };

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      setYearReady(false);
      setDisplayYearSegment(null);
      setRenderYearOffset(initialOffset);
      raf2 = window.requestAnimationFrame(() => {
        setDisplayYearSegment(activeYearSegment);
        setYearReady(true);
        yearAnimationRef.current = window.requestAnimationFrame(step);
      });
    });
    return () => {
      if (yearAnimationRef.current != null) {
        window.cancelAnimationFrame(yearAnimationRef.current);
      }
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [activeYearSegment, size.height, size.width]);

  const indicator = useMemo(() => {
    if (!activeOrbit || !size.width || !size.height) return null;
    const radius = ticks.indicatorRadius;
    const rad = (Math.PI / 180) * renderIndicatorAngle;
    const centerX = size.width / 2;
    const centerY = size.height - BOTTOM_PADDING;
    const normalX = -Math.sin(rad);
    const normalY = Math.cos(rad);
    const tipOffset = 14;
    const halfWidth = 7;
    const triangleDepth = 10;
    const lineGap = 6;
    const lineLength = Math.min(200, Math.max(120, size.width * 0.25)) * scale;
    const baseRadius = radius - tipOffset;
    const tipRadius = baseRadius - triangleDepth;
    const tipX = centerX + tipRadius * Math.cos(rad);
    const tipY = centerY + tipRadius * Math.sin(rad);
    const baseCenterX = centerX + baseRadius * Math.cos(rad);
    const baseCenterY = centerY + baseRadius * Math.sin(rad);
    const base1X = baseCenterX + normalX * halfWidth;
    const base1Y = baseCenterY + normalY * halfWidth;
    const base2X = baseCenterX - normalX * halfWidth;
    const base2Y = baseCenterY - normalY * halfWidth;
    const lineEndRadius = Math.max(0, tipRadius - lineGap);
    const lineStartRadius = Math.max(0, lineEndRadius - lineLength);
    const lineStartX = centerX + lineStartRadius * Math.cos(rad);
    const lineStartY = centerY + lineStartRadius * Math.sin(rad);
    const lineEndX = centerX + lineEndRadius * Math.cos(rad);
    const lineEndY = centerY + lineEndRadius * Math.sin(rad);
    return {
      centerX,
      centerY,
      lineStartX,
      lineStartY,
      lineEndX,
      lineEndY,
      tipX,
      tipY,
      base1X,
      base1Y,
      base2X,
      base2Y,
      trackRadius: radius,
    };
  }, [activeOrbit, renderIndicatorAngle, size, ticks.indicatorRadius, scale]);

  return (
    <div
      className={`orbit-timeline ${isInView ? "orbit-in" : ""} ${
        hasEntered ? "orbit-entered" : ""
      }`}
      ref={orbitRef}
    >
      <div
        className="orbit-canvas"
        ref={containerRef}
        style={{
          height: size.height || undefined,
          ["--orbit-scale" as string]: scale.toFixed(3),
          ["--orbit-detail-top" as string]: detailTop,
          ["--orbit-mask-start" as string]: maskStops.start,
          ["--orbit-mask-end" as string]: maskStops.end,
        }}
        data-active-domain={hoverDomain ?? active?.domain}
      >
        <svg
          className="orbit-svg"
          viewBox={`0 0 ${size.width || 1} ${size.height || 1}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {rings.map((ring, index) => (
            <circle
              key={index}
              className={`orbit-ring ${ring.domain}`}
              cx={ring.centerX}
              cy={ring.centerY}
              r={ring.radius}
            />
          ))}
          {ticks.yearTicks.map((tick, index) => {
            const rad = (Math.PI / 180) * tick.angle;
            const inner = tick.outerRadius - 6;
            const outer = tick.outerRadius + 6;
            const x1 = tick.centerX + inner * Math.cos(rad);
            const y1 = tick.centerY + inner * Math.sin(rad);
            const x2 = tick.centerX + outer * Math.cos(rad);
            const y2 = tick.centerY + outer * Math.sin(rad);
            return (
              <g key={`major-${index}`} className="orbit-tick-group">
                <line
                  className="orbit-tick major"
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                />
              </g>
            );
          })}
          {displayYearSegment && (
            <g
              transform={`rotate(${renderYearOffset} ${displayYearSegment.centerX} ${displayYearSegment.centerY})`}
            >
              <path
                className="orbit-year-arc"
                d={`M ${
                  displayYearSegment.centerX +
                  displayYearSegment.radius *
                    Math.cos((Math.PI / 180) * displayYearSegment.startAngle)
                } ${
                  displayYearSegment.centerY +
                  displayYearSegment.radius *
                    Math.sin((Math.PI / 180) * displayYearSegment.startAngle)
                } A ${displayYearSegment.radius} ${
                  displayYearSegment.radius
                } 0 ${
                  displayYearSegment.endAngle - displayYearSegment.startAngle >
                  180
                    ? 1
                    : 0
                } 1 ${
                  displayYearSegment.centerX +
                  displayYearSegment.radius *
                    Math.cos((Math.PI / 180) * displayYearSegment.endAngle)
                } ${
                  displayYearSegment.centerY +
                  displayYearSegment.radius *
                    Math.sin((Math.PI / 180) * displayYearSegment.endAngle)
                }`}
                style={{ opacity: yearReady ? 0.9 : 0 }}
              />
            </g>
          )}
          {ticks.yearLabels.map((tick, index) => {
            const rad = (Math.PI / 180) * tick.angle;
            const labelRadius = tick.outerRadius;
            const lx = tick.centerX + labelRadius * Math.cos(rad);
            const ly = tick.centerY + labelRadius * Math.sin(rad);
            const rotate = tick.angle + 90;
            return (
              <text
                key={`year-label-${index}`}
                className={`orbit-year-label${
                  activeOrbit?.year === tick.year ? " active" : ""
                }`}
                x={lx}
                y={ly}
                transform={`rotate(${rotate} ${lx} ${ly})`}
              >
                {tick.year}
              </text>
            );
          })}
          <g className="orbit-month-ring">
            {ticks.monthBoundaries.map((tick, index) => {
              const adjustedAngle = wrapAngle(tick.angle + renderRotation);
              const rad = (Math.PI / 180) * adjustedAngle;
              const inner = tick.outerRadius - 8;
              const outer = tick.outerRadius + 8;
              const x1 = tick.centerX + inner * Math.cos(rad);
              const y1 = tick.centerY + inner * Math.sin(rad);
              const x2 = tick.centerX + outer * Math.cos(rad);
              const y2 = tick.centerY + outer * Math.sin(rad);
              return (
                <line
                  key={`month-${index}`}
                  className="orbit-tick month"
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                />
              );
            })}
            {ticks.monthSubTicks.map((tick, index) => {
              const adjustedAngle = wrapAngle(tick.angle + renderRotation);
              const rad = (Math.PI / 180) * adjustedAngle;
              const inner = tick.outerRadius - 6;
              const outer = tick.outerRadius + 4;
              const x1 = tick.centerX + inner * Math.cos(rad);
              const y1 = tick.centerY + inner * Math.sin(rad);
              const x2 = tick.centerX + outer * Math.cos(rad);
              const y2 = tick.centerY + outer * Math.sin(rad);
              return (
                <line
                  key={`month-sub-${index}`}
                  className="orbit-tick sub"
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                />
              );
            })}
            {ticks.months.map((tick, index) => {
              const adjustedAngle = wrapAngle(tick.angle + renderRotation);
              const rad = (Math.PI / 180) * adjustedAngle;
              const labelRadius = tick.outerRadius + 12;
              const lx = tick.centerX + labelRadius * Math.cos(rad);
              const ly = tick.centerY + labelRadius * Math.sin(rad);
              const rotate = adjustedAngle + 90;
              return (
                <text
                  key={`month-label-${index}`}
                  className="orbit-month-label"
                  x={lx}
                  y={ly}
                  transform={`rotate(${rotate} ${lx} ${ly})`}
                >
                  {tick.label}
                </text>
              );
            })}
          </g>
          {indicator && (
            <g className="orbit-indicator">
              <circle
                className="orbit-indicator-track"
                cx={indicator.centerX}
                cy={indicator.centerY}
                r={indicator.trackRadius}
              />
              <line
                className="orbit-indicator-line"
                x1={indicator.lineStartX}
                y1={indicator.lineStartY}
                x2={indicator.lineEndX}
                y2={indicator.lineEndY}
              />
              <polygon
                className="orbit-indicator-head"
                points={`${indicator.tipX},${indicator.tipY} ${indicator.base1X},${indicator.base1Y} ${indicator.base2X},${indicator.base2Y}`}
              />
            </g>
          )}
        </svg>

        <div className="orbit-detail-layer">
          {previous && (
            <div className="orbit-detail orbit-detail-exit">
              <p className="orbit-detail-year">{previous.year}</p>
              <h4 className="orbit-detail-title">{previous.title}</h4>
              <p className="orbit-detail-text">{previous.detail}</p>
            </div>
          )}
          {active && (
            <div
              className={`orbit-detail ${
                isInView ? "orbit-detail-enter" : ""
              } ${isInView && !hasEntered ? "orbit-detail-initial" : ""}`}
              key={active.id}
            >
              <p className="orbit-detail-year">
                {activeOrbit?.monthLabel} {activeOrbit?.day} · {active.year}
              </p>
              <h4 className="orbit-detail-title">{active.title}</h4>
              <p className="orbit-detail-text">{active.detail}</p>
            </div>
          )}
        </div>

        {hoveredOrbit && (
          <div
            className="orbit-tooltip-overlay"
            style={{
              left: hoveredOrbit.x,
              top: hoveredOrbit.y,
            }}
          >
            {hoveredOrbit.monthLabel} {hoveredOrbit.day} · {hoveredOrbit.title}
          </div>
        )}

        {orbitData.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`orbit-node orbit-${item.domain} ${
              item.id === activeId ? "active" : ""
            }`}
            style={{
              left: item.centerX,
              top: item.centerY,
              ["--delay" as string]: `${item.index * 60}ms`,
              ["--radius" as string]: `${item.radius}px`,
              ["--angle" as string]: `${item.angle}deg`,
              ["--start-angle" as string]: `${item.startAngle}deg`,
            }}
            onClick={() => handleSelect(item.id)}
            onMouseEnter={() => {
              setHoverDomain(item.domain);
              setHoveredId(item.id);
            }}
            onMouseLeave={() => {
              setHoverDomain(null);
              setHoveredId(null);
            }}
            onFocus={() => setHoveredId(item.id)}
            onBlur={() => setHoveredId(null)}
            aria-label={`${item.monthLabel} ${item.day} ${item.year} ${item.title}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
