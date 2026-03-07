import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { KanbanController } from "./kanban.controller";
import { KanbanService } from "./kanban.service";
import { KanbanCard, KanbanCardSchema } from "./kanban-card.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KanbanCard.name, schema: KanbanCardSchema },
    ]),
  ],
  controllers: [KanbanController],
  providers: [KanbanService],
})
export class KanbanModule {}
