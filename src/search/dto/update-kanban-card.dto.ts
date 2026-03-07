import { IsString, IsOptional, IsEnum, IsNumber } from "class-validator";

export class UpdateKanbanCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(["backlog", "todo", "doing", "done"])
  status?: string;

  @IsOptional()
  @IsEnum(["low", "medium", "high", "urgent"])
  priority?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
