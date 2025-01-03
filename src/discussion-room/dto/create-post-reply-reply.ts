import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostReplyReplyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  userName: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  parentId: number;

  // @IsNotEmpty()
  // @IsBoolean()
  // isMember: boolean;
}
