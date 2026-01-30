"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Loader2, FileText } from "lucide-react";
import type { SlideContent, SlideType, GradientStyle } from "@/types/carousel";

interface NewsletterParserProps {
  onSlidesGenerated: (slides: SlideContent[]) => void;
}

const slideTemplates: Record<SlideType, Partial<SlideContent>> = {
  hook: {
    type: "hook",
    gradient: "burgundy",
    animation: "emerge",
  },
  problem: {
    type: "problem",
    gradient: "noir",
    animation: "slide-up",
  },
  solution: {
    type: "solution",
    gradient: "accent",
    animation: "materialize",
  },
  benefit: {
    type: "benefit",
    gradient: "mesh",
    animation: "slide-in",
  },
  "social-proof": {
    type: "social-proof",
    gradient: "noir",
    animation: "emerge",
  },
  cta: {
    type: "cta",
    gradient: "burgundy",
    animation: "materialize",
  },
  content: {
    type: "content",
    gradient: "noir",
    animation: "slide-up",
  },
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function parseNewsletterContent(content: string): SlideContent[] {
  const slides: SlideContent[] = [];
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return slides;

  // Hook slide - first paragraph or headline
  const hookText = paragraphs[0];
  slides.push({
    id: generateId(),
    ...slideTemplates.hook,
    headline: hookText.length > 80 ? hookText.substring(0, 80) + "..." : hookText,
    subheadline: hookText.length > 80 ? "" : paragraphs[1] || "",
    order: 0,
  } as SlideContent);

  // Problem slide - identify pain points
  if (paragraphs.length > 2) {
    const problemText = paragraphs.slice(1, 3).join(" ");
    const sentences = problemText.split(/[.!?]+/).filter((s) => s.trim());
    slides.push({
      id: generateId(),
      ...slideTemplates.problem,
      headline: "The Problem",
      bulletPoints: sentences.slice(0, 3).map((s) => s.trim()),
      order: 1,
    } as SlideContent);
  }

  // Solution/Content slides - middle content
  const middleContent = paragraphs.slice(3, -1);
  middleContent.forEach((para, index) => {
    const slideType: SlideType = index % 2 === 0 ? "solution" : "benefit";
    const sentences = para.split(/[.!?]+/).filter((s) => s.trim());

    slides.push({
      id: generateId(),
      ...slideTemplates[slideType],
      headline: sentences[0]?.trim() || "Key Point",
      body: sentences.slice(1, 3).join(". ").trim(),
      order: slides.length,
    } as SlideContent);
  });

  // CTA slide - last paragraph
  if (paragraphs.length > 1) {
    const ctaText = paragraphs[paragraphs.length - 1];
    slides.push({
      id: generateId(),
      ...slideTemplates.cta,
      headline: "Ready to Start?",
      subheadline: ctaText.length > 100 ? ctaText.substring(0, 100) + "..." : ctaText,
      ctaText: "Get Started",
      order: slides.length,
    } as SlideContent);
  }

  return slides;
}

export function NewsletterParser({ onSlidesGenerated }: NewsletterParserProps) {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParse = async () => {
    if (!content.trim()) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const slides = parseNewsletterContent(content);
    onSlidesGenerated(slides);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-burgundy/10 border border-burgundy/20">
          <FileText className="w-5 h-5 text-burgundy" />
        </div>
        <div>
          <h3 className="text-h4 text-white">Paste Your Newsletter</h3>
          <p className="text-small text-white-muted">
            AI will automatically fragment it into conversion-optimized slides
          </p>
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Paste your newsletter content here...

Example:
The #1 Mistake Killing Your Productivity

Most people think working more hours means getting more done. They're wrong.

The real problem? Context switching. Every time you jump between tasks, your brain needs 23 minutes to fully refocus.

Here's the solution: Time blocking. Dedicate specific chunks of time to single tasks.

Start with just 2 hours of focused work each morning. No emails. No meetings. Just deep work.

Ready to transform your productivity? Download my free time-blocking template.`}
        rows={12}
        className="w-full spark-glass-inset rounded-xl px-6 py-4 text-white bg-transparent placeholder:text-carbon-500 focus:outline-none focus:ring-1 focus:ring-burgundy resize-none text-body"
      />

      {/* Generate Button */}
      <motion.button
        onClick={handleParse}
        disabled={isProcessing || !content.trim()}
        className="w-full btn-cta-wrapper"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="btn-cta px-8 py-4 w-full">
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Slides</span>
            </>
          )}
        </div>
      </motion.button>

      {/* Tips */}
      <div className="spark-glass-inset rounded-lg p-4">
        <p className="text-label text-burgundy mb-2">Tips for best results:</p>
        <ul className="space-y-1 text-small text-white-muted">
          <li>- Start with a hook or headline</li>
          <li>- Include clear problems and solutions</li>
          <li>- End with a call to action</li>
          <li>- Use bullet points for lists</li>
        </ul>
      </div>
    </div>
  );
}
