import { IsNotEmpty, IsString } from 'class-validator';

export class DiscussionRoomPostPageInfoDto {
  @IsNotEmpty()
  @IsString()
  coinCode: string;

  @IsNotEmpty()
  @IsString()
  coinName: string;
}
