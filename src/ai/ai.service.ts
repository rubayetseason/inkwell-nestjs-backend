import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BlogPromptMode, buildBlogPrompt } from "constants/prompts";
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
    mode: BlogPromptMode,
  ): Promise<{ result: string; mode: string }> {
    const prompt = buildBlogPrompt(title, content, mode);

    const completion = await this.openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: prompt,
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
