import { Controller, Get, Query, Render } from '@nestjs/common';
import { DiscussionRoomService } from './discussion-room.service';
import { GetDiscussionRoomInfoDto } from './dto/get-discussion-room-info.dto';
import { DiscussionRoomPostPageInfoDto } from './dto/discussion-room-post-page-info.dto';

@Controller('discussion-room')
export class DiscussionRoomController {
  constructor(private readonly discussionRoomService: DiscussionRoomService) {}

  @Get()
  @Render('discussion-room')
  async discussionRoomInfo(
    @Query() getDiscussionRoomInfoDto: GetDiscussionRoomInfoDto,
  ) {
    const { coinInfo, coinName } =
      await this.discussionRoomService.getDiscussionRoomInfo(
        getDiscussionRoomInfoDto,
      );

    return {
      coinInfo,
      coinName,
      coinCode: getDiscussionRoomInfoDto.coinCode,
    };
  }

  @Get('post')
  @Render('discussion-room-post')
  async discussionRoomPost(
    @Query() discussionRoomPostPageInfoDto: DiscussionRoomPostPageInfoDto,
  ) {
    const { coinCode, coinName } = discussionRoomPostPageInfoDto;
    return {
      coinCode,
      coinName,
    };
  }
}
