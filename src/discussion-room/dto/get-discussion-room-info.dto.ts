import { IsNotEmpty, IsString } from 'class-validator';

export class GetDiscussionRoomInfoDto {
  @IsNotEmpty()
  @IsString()
  coinCode: string;
}
