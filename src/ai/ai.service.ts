import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENROUTER_API_KEY");

    if (!apiKey) {
      throw new BadRequestException("OpenRouter API key not configured");
    }

    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // your frontend
        "X-Title": "Blog Platform",
      },
    });
  }

  async analyzeBlog(
    content: string,
    title: string,
    mode: "tldr" | "tell_more",
  ): Promise<{ result: string; mode: string }> {
    const plainText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const prompts = {
      tldr: `
You are a concise summarizer.

Given the blog post titled "${title}", provide a TL;DR summary in 3-4 bullet points.

Rules:
- Each bullet must be a key takeaway
- Keep it clear and punchy
- Use "•" bullet formatting

Blog content:
${plainText.slice(0, 3000)}
`,

      tell_more: `
You are an insightful writer who expands on blog topics.

Given the blog post titled "${title}", provide 3-4 deeper insights or additional context.

Rules:
- Number the points
- Add background or implications
- Expand the author's ideas

Blog content:
${plainText.slice(0, 3000)}
`,
    };

    const completion = await this.openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: prompts[mode],
        },
      ],
    });

    const result =
      completion.choices?.[0]?.message?.content ?? "No response generated.";

    return {
      result,
      mode,
    };
  }
}
