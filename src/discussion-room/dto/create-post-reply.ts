import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostReplyDto {
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
  @IsNumber()
  postId: number;

  // @IsNotEmpty()
  // @IsBoolean()
  // isMember: boolean;
}
