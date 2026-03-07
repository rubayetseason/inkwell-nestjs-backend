import { IsString, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
