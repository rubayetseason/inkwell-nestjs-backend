import { IsString, IsNotEmpty } from 'class-validator';

export class AiMoveDto {
  @IsString()
  @IsNotEmpty()
  instruction: string;
}
