import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type KanbanCardDocument = KanbanCard & Document;

export type KanbanColumn = "backlog" | "todo" | "doing" | "done";
export type KanbanPriority = "low" | "medium" | "high" | "urgent";

@Schema({ timestamps: true })
export class KanbanCard {
  @Prop({ required: true })
  title: string;

  @Prop({ default: "" })
  description: string;

  @Prop({
    type: String,
    enum: ["backlog", "todo", "doing", "done"],
    default: "backlog",
  })
  status: KanbanColumn;

  @Prop({
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  })
  priority: KanbanPriority;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  owner: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;
}

export const KanbanCardSchema = SchemaFactory.createForClass(KanbanCard);
