import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDiscussionRoomPostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  userName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  coinCode: string;

  @IsNotEmpty()
  @IsString()
  coinName: string;

  @IsNotEmpty()
  @IsBoolean()
  isMember: boolean;
}
