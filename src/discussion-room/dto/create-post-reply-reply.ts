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
  replyContent: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  replyUserName: string;

  @IsOptional()
  @IsString()
  replyPassword?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  parentId: number;

  // @IsNotEmpty()
  // @IsBoolean()
  // isMember: boolean;
}
