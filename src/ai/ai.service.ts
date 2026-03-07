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

    return {
      result,
      mode,
    };
  }
}
