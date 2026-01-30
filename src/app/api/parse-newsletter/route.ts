import { NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert at converting newsletter content into engaging carousel slides for social media.

Your task is to analyze the newsletter text and break it into 4-7 slides optimized for conversion.

Rules:
1. NEVER modify or rewrite the original copy - use the exact words from the newsletter
2. Each slide should have a clear purpose (hook, problem, solution, benefit, social-proof, or cta)
3. Headlines should be impactful and under 80 characters
4. Extract bullet points from lists in the content
5. The first slide should always be a "hook" type
6. The last slide should always be a "cta" type

Respond ONLY with valid JSON in this exact format:
{
  "slides": [
    {
      "type": "hook" | "problem" | "solution" | "benefit" | "social-proof" | "cta" | "content",
      "headline": "string (max 80 chars)",
      "subheadline": "string (optional)",
      "body": "string (optional)",
      "bulletPoints": ["string"] (optional),
      "ctaText": "string (optional, only for cta type)"
    }
  ]
}`;

interface SlideFromAI {
  type: string;
  headline: string;
  subheadline?: string;
  body?: string;
  bulletPoints?: string[];
  ctaText?: string;
}

interface AIResponse {
  slides: SlideFromAI[];
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required", fallback: true },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey || apiKey === "sk-or-v1-your-key-here") {
      return NextResponse.json(
        { error: "OpenRouter API key not configured", fallback: true },
        { status: 200 }
      );
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://carousel-generator.vercel.app",
        "X-Title": "Carousel Generator",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Convert this newsletter into carousel slides:\n\n${content}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json(
        { error: "AI parsing failed", fallback: true },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return NextResponse.json(
        { error: "Empty AI response", fallback: true },
        { status: 200 }
      );
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonString = aiMessage;
    const jsonMatch = aiMessage.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    try {
      const parsed: AIResponse = JSON.parse(jsonString);

      if (!parsed.slides || !Array.isArray(parsed.slides)) {
        return NextResponse.json(
          { error: "Invalid AI response format", fallback: true },
          { status: 200 }
        );
      }

      return NextResponse.json({ slides: parsed.slides, fallback: false });
    } catch {
      console.error("Failed to parse AI response as JSON:", aiMessage);
      return NextResponse.json(
        { error: "Failed to parse AI response", fallback: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Parse newsletter error:", error);
    return NextResponse.json(
      { error: "Internal server error", fallback: true },
      { status: 500 }
    );
  }
}
