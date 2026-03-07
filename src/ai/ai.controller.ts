import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

class AnalyzeBlogDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(["tldr", "tell_more"])
  mode: "tldr" | "tell_more";
}

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("blog/analyze")
  async analyzeBlog(@Body() dto: AnalyzeBlogDto) {
    return this.aiService.analyzeBlog(dto.content, dto.title, dto.mode);
  }
}
