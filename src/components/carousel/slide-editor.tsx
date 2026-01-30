"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  SlideContent,
  SlideType,
  GradientStyle,
  AnimationStyle,
} from "@/types/carousel";
import { slideTypeLabels, slideTypeDescriptions } from "@/types/carousel";

interface SlideEditorProps {
  slide: SlideContent;
  onUpdate: (slide: SlideContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const gradientOptions: { value: GradientStyle; label: string }[] = [
  { value: "noir", label: "Noir" },
  { value: "burgundy", label: "Burgundy" },
  { value: "mesh", label: "Mesh" },
  { value: "accent", label: "Accent" },
  { value: "custom", label: "Custom" },
];

const animationOptions: { value: AnimationStyle; label: string }[] = [
  { value: "emerge", label: "Emerge" },
  { value: "slide-up", label: "Slide Up" },
  { value: "slide-in", label: "Slide In" },
  { value: "materialize", label: "Materialize" },
  { value: "none", label: "None" },
];

const slideTypeOptions: SlideType[] = [
  "hook",
  "problem",
  "solution",
  "benefit",
  "social-proof",
  "cta",
  "content",
];

export function SlideEditor({
  slide,
  onUpdate,
  onDelete,
}: SlideEditorProps) {
  const [newBulletPoint, setNewBulletPoint] = useState("");

  const handleChange = (
    field: keyof SlideContent,
    value: string | string[] | number
  ) => {
    onUpdate({ ...slide, [field]: value });
  };

  const addBulletPoint = () => {
    if (newBulletPoint.trim()) {
      const bulletPoints = [...(slide.bulletPoints || []), newBulletPoint.trim()];
      handleChange("bulletPoints", bulletPoints);
      setNewBulletPoint("");
    }
  };

  const removeBulletPoint = (index: number) => {
    const bulletPoints = (slide.bulletPoints || []).filter((_, i) => i !== index);
    handleChange("bulletPoints", bulletPoints);
  };

  return (
    <motion.div
      className="spark-glass rounded-xl p-6 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-carbon-500 cursor-grab" />
          <div>
            <h3 className="text-h4 text-white">{slideTypeLabels[slide.type]}</h3>
            <p className="text-small text-white-muted">
              {slideTypeDescriptions[slide.type]}
            </p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-carbon-800 transition-colors text-carbon-400 hover:text-error"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Type */}
      <div className="space-y-2">
        <label className="text-label text-white-muted">Slide Type</label>
        <select
          value={slide.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-burgundy"
        >
          {slideTypeOptions.map((type) => (
            <option key={type} value={type} className="bg-carbon-900">
              {slideTypeLabels[type]}
            </option>
          ))}
        </select>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <label className="text-label text-white-muted">Headline</label>
        <input
          type="text"
          value={slide.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
          placeholder="Enter a powerful headline..."
          className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy"
        />
      </div>

      {/* Subheadline */}
      <div className="space-y-2">
        <label className="text-label text-white-muted">Subheadline</label>
        <input
          type="text"
          value={slide.subheadline || ""}
          onChange={(e) => handleChange("subheadline", e.target.value)}
          placeholder="Supporting text..."
          className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy"
        />
      </div>

      {/* Body */}
      <div className="space-y-2">
        <label className="text-label text-white-muted">Body Text</label>
        <textarea
          value={slide.body || ""}
          onChange={(e) => handleChange("body", e.target.value)}
          placeholder="Additional content..."
          rows={3}
          className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy resize-none"
        />
      </div>

      {/* Bullet Points */}
      <div className="space-y-2">
        <label className="text-label text-white-muted">Bullet Points</label>
        <div className="space-y-2">
          {(slide.bulletPoints || []).map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="led-indicator led-indicator--on" />
              <span className="flex-1 text-body text-white">{point}</span>
              <button
                onClick={() => removeBulletPoint(index)}
                className="p-1 hover:text-error transition-colors text-carbon-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newBulletPoint}
              onChange={(e) => setNewBulletPoint(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBulletPoint()}
              placeholder="Add bullet point..."
              className="flex-1 spark-glass-inset rounded-lg px-4 py-2 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
            <button
              onClick={addBulletPoint}
              className="p-2 rounded-lg bg-carbon-800 hover:bg-carbon-700 transition-colors text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Text */}
      <div className="space-y-2">
        <label className="text-label text-white-muted">CTA Button Text</label>
        <input
          type="text"
          value={slide.ctaText || ""}
          onChange={(e) => handleChange("ctaText", e.target.value)}
          placeholder="Learn More, Get Started, etc."
          className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy"
        />
      </div>

      {/* Style Options */}
      <div className="grid grid-cols-2 gap-4">
        {/* Gradient */}
        <div className="space-y-2">
          <label className="text-label text-white-muted">Background</label>
          <select
            value={slide.gradient}
            onChange={(e) => handleChange("gradient", e.target.value)}
            className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-burgundy"
          >
            {gradientOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-carbon-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Animation */}
        <div className="space-y-2">
          <label className="text-label text-white-muted flex items-center gap-2">
            Animation
            <Sparkles className="w-3 h-3 text-burgundy" />
          </label>
          <select
            value={slide.animation}
            onChange={(e) => handleChange("animation", e.target.value)}
            className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white bg-transparent focus:outline-none focus:ring-1 focus:ring-burgundy"
          >
            {animationOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-carbon-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Gradient */}
      {slide.gradient === "custom" && (
        <div className="space-y-2">
          <label className="text-label text-white-muted">Custom Gradient CSS</label>
          <input
            type="text"
            value={slide.customGradient || ""}
            onChange={(e) => handleChange("customGradient", e.target.value)}
            placeholder="linear-gradient(135deg, #000 0%, #333 100%)"
            className="w-full spark-glass-inset rounded-lg px-4 py-3 text-white font-mono text-sm bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
        </div>
      )}
    </motion.div>
  );
}
