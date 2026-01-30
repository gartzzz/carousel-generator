"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CausticOverlayProps {
  className?: string;
  intensity?: "subtle" | "medium" | "intense";
  speed?: "slow" | "normal" | "fast";
}

const intensityConfig = {
  subtle: { opacity: 0.04, blur: 40 },
  medium: { opacity: 0.08, blur: 30 },
  intense: { opacity: 0.12, blur: 20 },
};

const speedConfig = {
  slow: 20,
  normal: 12,
  fast: 6,
};

export function CausticOverlay({
  className,
  intensity = "subtle",
  speed = "slow",
}: CausticOverlayProps) {
  const id = useId();
  const config = intensityConfig[intensity];
  const duration = speedConfig[speed];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <defs>
          {/* Fresnel edge gradient - more brightness at edges */}
          <radialGradient id={`${id}-fresnel`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="60%" stopColor="transparent" />
            <stop offset="85%" stopColor="hsl(40, 20%, 95%)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="hsl(40, 25%, 98%)" stopOpacity="0.06" />
          </radialGradient>

          {/* Caustic blur filter */}
          <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={config.blur / 10} />
          </filter>
        </defs>

        {/* Fresnel edge highlight */}
        <rect width="100%" height="100%" fill={`url(#${id}-fresnel)`} />

        {/* Animated caustic light patterns */}
        <g filter={`url(#${id}-blur)`} opacity={config.opacity}>
          <motion.ellipse
            cx="30"
            cy="35"
            rx="25"
            ry="18"
            fill="hsl(40, 25%, 98%)"
            animate={{
              cx: [30, 50, 70, 30],
              cy: [35, 55, 40, 35],
              rx: [25, 35, 28, 25],
              ry: [18, 25, 20, 18],
              opacity: [0.5, 0.8, 0.6, 0.5],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.ellipse
            cx="70"
            cy="65"
            rx="30"
            ry="22"
            fill="hsl(40, 20%, 95%)"
            animate={{
              cx: [70, 45, 60, 70],
              cy: [65, 45, 70, 65],
              rx: [30, 25, 35, 30],
              ry: [22, 18, 28, 22],
              opacity: [0.6, 0.9, 0.7, 0.6],
            }}
            transition={{
              duration: duration * 1.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: duration * 0.3,
            }}
          />
          <motion.ellipse
            cx="50"
            cy="50"
            rx="20"
            ry="15"
            fill="hsl(40, 22%, 96%)"
            animate={{
              cx: [50, 35, 65, 50],
              cy: [50, 60, 45, 50],
              rx: [20, 28, 22, 20],
              ry: [15, 20, 18, 15],
              opacity: [0.4, 0.7, 0.5, 0.4],
            }}
            transition={{
              duration: duration * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: duration * 0.6,
            }}
          />
        </g>
      </svg>
    </div>
  );
}
