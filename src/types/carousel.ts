export type SlideType =
  | "hook"
  | "problem"
  | "solution"
  | "benefit"
  | "social-proof"
  | "cta"
  | "content";

export type GradientStyle =
  | "noir"
  | "accent"
  | "mesh"
  | "subtle"
  | "custom";

export type AnimationStyle =
  | "emerge"
  | "slide-up"
  | "slide-in"
  | "materialize"
  | "none";

export interface SlideContent {
  id: string;
  type: SlideType;
  headline: string;
  subheadline?: string;
  body?: string;
  bulletPoints?: string[];
  ctaText?: string;
  imageUrl?: string;
  gradient: GradientStyle;
  customGradient?: string;
  animation: AnimationStyle;
  order: number;
}

export interface CarouselSettings {
  aspectRatio: "4:5" | "1:1" | "9:16";
  showSlideNumbers: boolean;
  showProgressDots: boolean;
  brandName?: string;
  brandColor?: string;
  showEnergyWires: boolean;
  showDotGrid: boolean;
  showGlowEffects: boolean;
}

export interface Carousel {
  id: string;
  title: string;
  slides: SlideContent[];
  settings: CarouselSettings;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultCarouselSettings: CarouselSettings = {
  aspectRatio: "4:5",
  showSlideNumbers: true,
  showProgressDots: true,
  showEnergyWires: true,
  showDotGrid: true,
  showGlowEffects: true,
};

export const slideTypeLabels: Record<SlideType, string> = {
  hook: "Hook",
  problem: "Problem",
  solution: "Solution",
  benefit: "Benefit",
  "social-proof": "Social Proof",
  cta: "Call to Action",
  content: "Content",
};

export const slideTypeDescriptions: Record<SlideType, string> = {
  hook: "Grab attention with a powerful opening",
  problem: "Identify the pain point",
  solution: "Present your solution",
  benefit: "Highlight key benefits",
  "social-proof": "Show testimonials or stats",
  cta: "Drive action",
  content: "Custom content slide",
};
