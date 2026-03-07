import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { KanbanService } from "./kanban.service";
import { CreateKanbanCardDto } from "./dto/create-kanban-card.dto";
import { UpdateKanbanCardDto } from "./dto/update-kanban-card.dto";
import { AiMoveDto } from "./dto/ai-move.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("kanban")
@UseGuards(JwtAuthGuard)
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get("board")
  async getBoard(@Request() req) {
    return this.kanbanService.getBoard(req.user.userId);
  }

  @Post("cards")
  async createCard(@Request() req, @Body() dto: CreateKanbanCardDto) {
    return this.kanbanService.createCard(req.user.userId, dto);
  }

  @Patch("cards/:id")
  async updateCard(
    @Request() req,
    @Param("id") id: string,
    @Body() dto: UpdateKanbanCardDto,
  ) {
    return this.kanbanService.updateCard(id, req.user.userId, dto);
  }

  @Delete("cards/:id")
  async deleteCard(@Request() req, @Param("id") id: string) {
    await this.kanbanService.deleteCard(id, req.user.userId);
    return { message: "Card deleted" };
  }

  @Post("ai-move")
  async aiMove(@Request() req, @Body() dto: AiMoveDto) {
    return this.kanbanService.aiMoveCards(req.user.userId, dto.instruction);
  }
}
