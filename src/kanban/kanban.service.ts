import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateKanbanCardDto } from "./dto/create-kanban-card.dto";
import { UpdateKanbanCardDto } from "./dto/update-kanban-card.dto";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { KanbanCard, KanbanCardDocument } from "./kanban-card.schema";
import { buildKanbanMovePrompt } from "constants/prompts";

@Injectable()
export class KanbanService {
  private openai: OpenAI;

  constructor(
    @InjectModel(KanbanCard.name)
    private kanbanModel: Model<KanbanCardDocument>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>("OPENROUTER_API_KEY");

    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Kanban AI",
      },
    });
  }

  async getBoard(userId: string): Promise<KanbanCardDocument[]> {
    return this.kanbanModel
      .find({ owner: new Types.ObjectId(userId) })
      .sort({ status: 1, order: 1, createdAt: 1 });
  }

  async createCard(
    userId: string,
    dto: CreateKanbanCardDto,
  ): Promise<KanbanCardDocument> {
    const existing = await this.kanbanModel
      .find({
        owner: new Types.ObjectId(userId),
        status: dto.status || "backlog",
      })
      .sort({ order: -1 })
      .limit(1);

    const order = existing.length > 0 ? existing[0].order + 1 : 0;

    const card = new this.kanbanModel({
      ...dto,
      owner: new Types.ObjectId(userId),
      order,
    });

    return card.save();
  }

  async updateCard(
    cardId: string,
    userId: string,
    dto: UpdateKanbanCardDto,
  ): Promise<KanbanCardDocument> {
    if (!Types.ObjectId.isValid(cardId))
      throw new NotFoundException("Card not found");

    const card = await this.kanbanModel.findById(cardId);

    if (!card) throw new NotFoundException("Card not found");

    if (card.owner.toString() !== userId)
      throw new ForbiddenException("Not authorized");

    const updated = await this.kanbanModel.findByIdAndUpdate(
      cardId,
      { $set: dto },
      { new: true },
    );

    return updated;
  }

  async deleteCard(cardId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(cardId))
      throw new NotFoundException("Card not found");

    const card = await this.kanbanModel.findById(cardId);

    if (!card) throw new NotFoundException("Card not found");

    if (card.owner.toString() !== userId)
      throw new ForbiddenException("Not authorized");

    await this.kanbanModel.findByIdAndDelete(cardId);
  }

  async aiMoveCards(
    userId: string,
    instruction: string,
  ): Promise<{ moved: number; actions: any[] }> {
    const cards = await this.getBoard(userId);

    if (cards.length === 0) {
      return { moved: 0, actions: [] };
    }

    const cardsSummary = cards.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      status: c.status,
      priority: c.priority,
    }));

    const prompt = buildKanbanMovePrompt(instruction, cardsSummary);

    const completion = await this.openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices?.[0]?.message?.content ?? "[]";

    console.log("AI RAW RESPONSE:", text);

    let actions: { cardId: string; newStatus: string }[] = [];

    try {
      const clean = text.replace(/```json|```/g, "").trim();

      const parsed = JSON.parse(clean);

      if (Array.isArray(parsed)) {
        actions = parsed;
      } else if (Array.isArray(parsed.actions)) {
        actions = parsed.actions;
      }
    } catch (err) {
      console.log("JSON PARSE ERROR:", err);
      return { moved: 0, actions: [] };
    }

    let moved = 0;

    for (const action of actions) {
      if (action.cardId && action.newStatus) {
        await this.kanbanModel.findOneAndUpdate(
          { _id: action.cardId, owner: new Types.ObjectId(userId) },
          { $set: { status: action.newStatus } },
        );

        moved++;
      }
    }

    return { moved, actions };
  }
}
