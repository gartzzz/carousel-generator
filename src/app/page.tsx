"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DotGrid, EnergyWire, GlowBorder } from "@/components/decorative";
import {
  SlidePreview,
  SlideEditor,
  NewsletterParser,
} from "@/components/carousel";
import type { SlideContent, CarouselSettings } from "@/types/carousel";
import { defaultCarouselSettings } from "@/types/carousel";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const initialSlide: SlideContent = {
  id: generateId(),
  type: "hook",
  headline: "Your Newsletter Title",
  subheadline: "Transform it into engaging carousel slides",
  gradient: "accent",
  animation: "emerge",
  order: 0,
};

export default function Home() {
  const [slides, setSlides] = useState<SlideContent[]>([initialSlide]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [settings, setSettings] = useState<CarouselSettings>(
    defaultCarouselSettings
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showParser, setShowParser] = useState(true);

  const activeSlide = slides[activeSlideIndex];

  const handleUpdateSlide = (updatedSlide: SlideContent) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === updatedSlide.id ? updatedSlide : slide
      )
    );
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((slide) => slide.id !== id));
    if (activeSlideIndex >= slides.length - 1) {
      setActiveSlideIndex(Math.max(0, slides.length - 2));
    }
  };

  const handleAddSlide = () => {
    const newSlide: SlideContent = {
      id: generateId(),
      type: "content",
      headline: "New Slide",
      gradient: "noir",
      animation: "slide-up",
      order: slides.length,
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleSlidesGenerated = (newSlides: SlideContent[]) => {
    setSlides(newSlides);
    setActiveSlideIndex(0);
    setShowParser(false);
  };

  const navigateSlide = (direction: "prev" | "next") => {
    if (direction === "prev" && activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    } else if (direction === "next" && activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background decorations */}
      <DotGrid pattern="fade-edges" opacity={0.15} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Header */}
      <header className="relative z-10 border-b border-accent/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GlowBorder
                glowColor="var(--accent)"
                glowIntensity="subtle"
                borderRadius={8}
              >
                <div className="p-2">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </GlowBorder>
              <div>
                <h1 className="text-h4 text-white">Carousel Generator</h1>
                <p className="text-small text-white-muted">
                  Newsletter to Slides
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showSettings
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-carbon-800 text-carbon-400"
                )}
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="btn-cta-wrapper">
                <button className="btn-cta px-4 py-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Preview */}
          <div className="space-y-6">
            {/* Main Preview */}
            <div className="spark-glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-label text-white-muted">Preview</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateSlide("prev")}
                    disabled={activeSlideIndex === 0}
                    className="p-1 rounded hover:bg-carbon-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-label text-white-muted">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    onClick={() => navigateSlide("next")}
                    disabled={activeSlideIndex === slides.length - 1}
                    className="p-1 rounded hover:bg-carbon-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeSlide && (
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center"
                  >
                    <SlidePreview
                      slide={activeSlide}
                      settings={settings}
                      slideNumber={activeSlideIndex + 1}
                      totalSlides={slides.length}
                      scale={0.5}
                      isActive
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slide Thumbnails */}
            <div className="spark-glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-white-muted" />
                  <span className="text-label text-white-muted">Slides</span>
                </div>
                <button
                  onClick={handleAddSlide}
                  className="p-1 rounded hover:bg-carbon-800 transition-colors text-accent"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    className={cn(
                      "flex-shrink-0 w-24 cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                      index === activeSlideIndex
                        ? "border-accent"
                        : "border-transparent hover:border-carbon-600"
                    )}
                    onClick={() => setActiveSlideIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SlidePreview
                      slide={slide}
                      settings={{ ...settings, showProgressDots: false }}
                      slideNumber={index + 1}
                      scale={0.1}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div className="space-y-6">
            {/* Toggle Parser/Editor */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowParser(true)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-label transition-colors",
                  showParser
                    ? "bg-accent text-black"
                    : "bg-carbon-800 text-white-muted hover:bg-carbon-700"
                )}
              >
                Import Newsletter
              </button>
              <button
                onClick={() => setShowParser(false)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-label transition-colors",
                  !showParser
                    ? "bg-accent text-black"
                    : "bg-carbon-800 text-white-muted hover:bg-carbon-700"
                )}
              >
                Edit Slides
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showParser ? (
                <motion.div
                  key="parser"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="spark-glass rounded-2xl p-6">
                    <NewsletterParser onSlidesGenerated={handleSlidesGenerated} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {activeSlide && (
                    <SlideEditor
                      slide={activeSlide}
                      onUpdate={handleUpdateSlide}
                      onDelete={() => handleDeleteSlide(activeSlide.id)}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="spark-glass rounded-xl p-6 space-y-4">
                    <h3 className="text-h4 text-white">Settings</h3>

                    {/* Aspect Ratio */}
                    <div className="space-y-2">
                      <label className="text-label text-white-muted">
                        Aspect Ratio
                      </label>
                      <div className="flex gap-2">
                        {(["4:5", "1:1", "9:16"] as const).map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() =>
                              setSettings({ ...settings, aspectRatio: ratio })
                            }
                            className={cn(
                              "flex-1 py-2 rounded-lg text-label transition-colors",
                              settings.aspectRatio === ratio
                                ? "bg-accent text-black"
                                : "bg-carbon-800 text-white-muted hover:bg-carbon-700"
                            )}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                      {[
                        { key: "showSlideNumbers", label: "Slide Numbers" },
                        { key: "showProgressDots", label: "Progress Dots" },
                        { key: "showEnergyWires", label: "Energy Wires" },
                        { key: "showDotGrid", label: "Dot Grid" },
                        { key: "showGlowEffects", label: "Glow Effects" },
                      ].map(({ key, label }) => (
                        <label
                          key={key}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-body text-white">{label}</span>
                          <button
                            onClick={() =>
                              setSettings({
                                ...settings,
                                [key]: !settings[key as keyof CarouselSettings],
                              })
                            }
                            className={cn(
                              "w-12 h-6 rounded-full transition-colors relative",
                              settings[key as keyof CarouselSettings]
                                ? "bg-accent"
                                : "bg-carbon-700"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                                settings[key as keyof CarouselSettings]
                                  ? "left-7"
                                  : "left-1"
                              )}
                            />
                          </button>
                        </label>
                      ))}
                    </div>

                    {/* Brand Name */}
                    <div className="space-y-2">
                      <label className="text-label text-white-muted">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.brandName || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, brandName: e.target.value })
                        }
                        placeholder="Your brand"
                        className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
        <EnergyWire
          width="100%"
          height={60}
          direction="horizontal"
          pathType="straight"
          glowIntensity="low"
          beamCount={3}
          speed="slow"
        />
      </div>
    </main>
  );
}
