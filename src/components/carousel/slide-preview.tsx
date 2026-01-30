"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DotGrid, EnergyWire, CausticOverlay } from "@/components/decorative";
import type { SlideContent, CarouselSettings } from "@/types/carousel";

interface SlidePreviewProps {
  slide: SlideContent;
  settings: CarouselSettings;
  isActive?: boolean;
  slideNumber?: number;
  totalSlides?: number;
  scale?: number;
  onClick?: () => void;
}

const animationVariants = {
  emerge: {
    initial: { opacity: 0, y: 12, scale: 0.98, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  "slide-in": {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  materialize: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  none: {
    initial: {},
    animate: {},
  },
};

export function SlidePreview({
  slide,
  settings,
  isActive = false,
  slideNumber,
  totalSlides,
  scale = 0.3,
  onClick,
}: SlidePreviewProps) {
  const aspectRatioClass = {
    "4:5": "aspect-[4/5]",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  }[settings.aspectRatio];

  const variants = animationVariants[slide.animation];

  return (
    <div
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl transition-all",
        aspectRatioClass,
        isActive && "ring-2 ring-ivory-200 ring-offset-2 ring-offset-black"
      )}
      style={{ width: `${100 * scale}%`, minWidth: 200 }}
      onClick={onClick}
    >
      {/* Background - Always breathing gradient */}
      <div
        className={cn(
          "absolute inset-0",
          slide.gradient === "custom" ? "" : "gradient-breathing"
        )}
        style={
          slide.gradient === "custom" && slide.customGradient
            ? { background: slide.customGradient }
            : undefined
        }
      />

      {/* Caustic/Fresnel light effects */}
      {settings.showGlowEffects && slide.gradient !== "custom" && (
        <CausticOverlay intensity="subtle" speed="slow" />
      )}

      {/* Decorative elements */}
      {settings.showDotGrid && (
        <DotGrid pattern="fade-edges" opacity={0.2} />
      )}

      {settings.showEnergyWires && (
        <>
          <div className="absolute top-0 left-0 right-0">
            <EnergyWire
              width="100%"
              height={40}
              direction="horizontal"
              pathType="curved"
              curveIntensity={0.2}
              glowIntensity="low"
              beamCount={2}
              speed="slow"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <EnergyWire
              width="100%"
              height={40}
              direction="horizontal"
              pathType="curved"
              curveIntensity={0.2}
              glowIntensity="low"
              beamCount={2}
              speed="slow"
            />
          </div>
        </>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-center"
        style={{ padding: "var(--rhythm-6)" }}
        initial={variants.initial}
        animate={variants.animate}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        {/* Slide number */}
        {settings.showSlideNumbers && slideNumber && (
          <div className="absolute top-6 left-6">
            <span className="slide-label">
              {String(slideNumber).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Main content - centered with max-width constraint */}
        <div
          className="flex-1 flex flex-col justify-center items-center text-center"
          style={{ maxWidth: "70%", margin: "0 auto" }}
        >
          {slide.headline && (
            <h2 className="slide-headline mb-4">{slide.headline}</h2>
          )}

          {slide.subheadline && (
            <p className="slide-subheadline mb-6" style={{ color: "var(--ivory-200)" }}>
              {slide.subheadline}
            </p>
          )}

          {slide.body && (
            <p className="slide-body max-w-md">{slide.body}</p>
          )}

          {slide.bulletPoints && slide.bulletPoints.length > 0 && (
            <ul className="space-y-3 mt-6 text-left">
              {slide.bulletPoints.map((point, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 slide-bullet"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="led-indicator led-indicator--on mt-1.5 flex-shrink-0" />
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {slide.ctaText && (
            <div className="mt-8">
              <div className="btn-cta-wrapper">
                <button className="btn-cta slide-cta px-8 py-3">{slide.ctaText}</button>
              </div>
            </div>
          )}
        </div>

        {/* Progress dots */}
        {settings.showProgressDots && totalSlides && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index + 1 === slideNumber
                    ? "bg-ivory-100 w-6"
                    : "bg-carbon-700 w-1.5"
                )}
              />
            ))}
          </div>
        )}

        {/* Brand */}
        {settings.brandName && (
          <div className="absolute bottom-6 right-6">
            <span
              className="slide-label"
              style={{ color: settings.brandColor || "var(--ivory-500)" }}
            >
              {settings.brandName}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
