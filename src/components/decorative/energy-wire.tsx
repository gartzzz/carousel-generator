"use client";

import { forwardRef, useId, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface EnergyWireProps {
  width?: number | string;
  height?: number;
  className?: string;
  direction?: "horizontal" | "vertical" | "diagonal";
  pathType?: "straight" | "curved";
  customPath?: string;
  curveIntensity?: number;
  beamColor?: string;
  wireColor?: string;
  glowIntensity?: "none" | "low" | "medium" | "high";
  wireWidth?: number;
  beamWidth?: number;
  speed?: "slow" | "normal" | "fast" | number;
  beamLength?: number;
  beamCount?: number;
  active?: boolean;
}

const speedToMs = (speed: EnergyWireProps["speed"]): number => {
  if (typeof speed === "number") return speed;
  const map = { slow: 3000, normal: 1500, fast: 800 };
  return map[speed ?? "normal"];
};

const glowIntensityMap = {
  none: 0,
  low: 2,
  medium: 4,
  high: 8,
};

function generatePath(
  width: number,
  height: number,
  direction: "horizontal" | "vertical" | "diagonal",
  pathType: "straight" | "curved",
  curveIntensity: number = 0.3
): string {
  const padding = 4;
  const w = width - padding * 2;
  const h = height - padding * 2;

  switch (direction) {
    case "horizontal":
      if (pathType === "curved") {
        const cy = h / 2;
        const curve = h * curveIntensity;
        return `M ${padding},${cy + padding} Q ${w / 2 + padding},${cy - curve + padding} ${w + padding},${cy + padding}`;
      }
      return `M ${padding},${height / 2} L ${width - padding},${height / 2}`;

    case "vertical":
      if (pathType === "curved") {
        const cx = w / 2;
        const curve = w * curveIntensity;
        return `M ${cx + padding},${padding} Q ${cx + curve + padding},${h / 2 + padding} ${cx + padding},${h + padding}`;
      }
      return `M ${width / 2},${padding} L ${width / 2},${height - padding}`;

    case "diagonal":
      if (pathType === "curved") {
        return `M ${padding},${padding} Q ${width / 2},${height / 2} ${width - padding},${height - padding}`;
      }
      return `M ${padding},${padding} L ${width - padding},${height - padding}`;

    default:
      return `M ${padding},${height / 2} L ${width - padding},${height / 2}`;
  }
}

export const EnergyWire = forwardRef<SVGSVGElement, EnergyWireProps>(
  function EnergyWire(
    {
      width = "100%",
      height = 40,
      className,
      direction = "horizontal",
      pathType = "straight",
      customPath,
      curveIntensity = 0.3,
      beamColor = "var(--burgundy)",
      wireColor = "var(--carbon-600)",
      glowIntensity = "medium",
      wireWidth = 1.5,
      beamWidth = 2,
      speed = "normal",
      beamLength = 15,
      beamCount = 1,
      active = true,
    },
    ref
  ) {
    const uniqueId = useId();
    const filterId = `wire-glow-${uniqueId}`;

    const numericWidth = typeof width === "number" ? width : 200;
    const numericHeight = typeof height === "number" ? height : 40;

    const path = useMemo(() => {
      if (customPath) return customPath;
      return generatePath(
        numericWidth,
        numericHeight,
        direction,
        pathType,
        curveIntensity
      );
    }, [customPath, numericWidth, numericHeight, direction, pathType, curveIntensity]);

    const glowBlur = glowIntensityMap[glowIntensity];
    const duration = `${speedToMs(speed)}ms`;

    const beamOffsets = useMemo(() => {
      if (beamCount === 1) return [0];
      if (beamCount === 2) return [0, 50];
      return [0, 33, 66];
    }, [beamCount]);

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${numericWidth} ${numericHeight}`}
        className={cn("energy-wire", className)}
        aria-hidden="true"
      >
        <defs>
          {glowIntensity !== "none" && (
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={glowBlur} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Wire base */}
        <path
          d={path}
          fill="none"
          stroke={wireColor}
          strokeWidth={wireWidth}
          strokeOpacity={0.3}
          strokeLinecap="round"
        />

        {/* Energy beams */}
        {active &&
          beamOffsets.map((offset, index) => (
            <path
              key={index}
              d={path}
              fill="none"
              stroke={beamColor}
              strokeWidth={beamWidth}
              strokeLinecap="round"
              strokeDasharray={`${beamLength} ${100 - beamLength}`}
              filter={glowIntensity !== "none" ? `url(#${filterId})` : undefined}
              style={
                {
                  "--wire-duration": duration,
                  "--wire-delay": `${(offset / 100) * speedToMs(speed)}ms`,
                } as React.CSSProperties
              }
              className="energy-wire-beam"
            />
          ))}
      </svg>
    );
  }
);
