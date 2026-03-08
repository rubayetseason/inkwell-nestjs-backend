import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  KanbanColumn,
  KanbanColumnArray,
  KanbanPriority,
  KanbanPriorityArray,
} from "constants/enums";
import { Document, Types } from "mongoose";

export type KanbanCardDocument = KanbanCard & Document;

@Schema({ timestamps: true })
export class KanbanCard {
  @Prop({ required: true })
  title: string;

  @Prop({ default: "" })
  description: string;

  @Prop({
    type: String,
    enum: KanbanColumnArray,
    default: "backlog",
  })
  status: KanbanColumn;

  @Prop({
    type: String,
    enum: KanbanPriorityArray,
    default: "medium",
  })
  priority: KanbanPriority;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  owner: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;
}

export const KanbanCardSchema = SchemaFactory.createForClass(KanbanCard);
