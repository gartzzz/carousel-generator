"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface DotGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
  opacity?: number;
  pattern?: "square" | "radial" | "fade-edges";
  animate?: boolean;
}

export function DotGrid({
  className,
  dotColor = "var(--carbon-700)",
  dotSize = 1,
  gap = 24,
  opacity = 0.5,
  pattern = "square",
  animate = false,
}: DotGridProps) {
  const patternId = useMemo(
    () => `dot-pattern-${Math.random().toString(36).slice(2)}`,
    []
  );
  const maskId = `${patternId}-mask`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gap / 2}
              cy={gap / 2}
              r={dotSize}
              fill={dotColor}
              opacity={opacity}
              className={animate ? "animate-pulse" : undefined}
            />
          </pattern>

          {pattern === "fade-edges" && (
            <radialGradient id={maskId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          )}

          {pattern === "radial" && (
            <radialGradient id={maskId} cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
          )}
        </defs>

        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          mask={pattern !== "square" ? `url(#${maskId}-rect)` : undefined}
        />

        {pattern !== "square" && (
          <mask id={`${maskId}-rect`}>
            <rect width="100%" height="100%" fill={`url(#${maskId})`} />
          </mask>
        )}
      </svg>
    </div>
  );
}
