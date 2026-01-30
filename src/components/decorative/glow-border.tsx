"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: "subtle" | "normal" | "intense";
  borderWidth?: number;
  borderRadius?: number | string;
  animated?: boolean;
  animationType?: "pulse" | "breathe";
}

const intensityMap = {
  subtle: { blur: "8px", spread: "2px" },
  normal: { blur: "16px", spread: "4px" },
  intense: { blur: "24px", spread: "8px" },
};

export const GlowBorder = forwardRef<HTMLDivElement, GlowBorderProps>(
  function GlowBorder(
    {
      children,
      className,
      glowColor = "var(--accent)",
      glowIntensity = "normal",
      borderWidth = 1,
      borderRadius = 12,
      animated = false,
      animationType = "pulse",
    },
    ref
  ) {
    const intensity = intensityMap[glowIntensity];
    const radius =
      typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          animated && animationType === "pulse" && "animate-[glow-breathe_2s_ease-in-out_infinite]",
          animated && animationType === "breathe" && "animate-[glow-breathe_3s_ease-in-out_infinite]",
          className
        )}
        style={
          {
            "--glow-color": glowColor,
            "--glow-blur": intensity.blur,
            "--glow-spread": intensity.spread,
            "--border-width": `${borderWidth}px`,
            "--border-radius": radius,
          } as React.CSSProperties
        }
      >
        {/* Glow layer */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: radius,
            boxShadow: `0 0 ${intensity.blur} ${intensity.spread} ${glowColor}`,
          }}
          aria-hidden="true"
        />

        {/* Border layer */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: radius,
            border: `${borderWidth}px solid ${glowColor}`,
            opacity: 0.6,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
