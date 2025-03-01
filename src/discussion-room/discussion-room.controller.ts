import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { DiscussionRoomService } from './discussion-room.service';
import { GetDiscussionRoomInfoDto } from './dto/get-discussion-room-info.dto';
import { DiscussionRoomPostPageInfoDto } from './dto/discussion-room-post-page-info.dto';
import { Request, Response } from 'express';
import { CreateDiscussionRoomPostDto } from './dto/create-discussion-room-post.dto';
import { CreatePostReplyDto } from './dto/create-post-reply';
import { CreatePostReplyReplyDto } from './dto/create-post-reply-reply';

@Controller('discussion-room')
export class DiscussionRoomController {
  constructor(private readonly discussionRoomService: DiscussionRoomService) {}

  @Get()
  @Render('discussion-room')
  async discussionRoomInfo(
    @Query() getDiscussionRoomInfoDto: GetDiscussionRoomInfoDto,
  ) {
    const { coinInfo, coinName, posts } =
      await this.discussionRoomService.getDiscussionRoomInfo(
        getDiscussionRoomInfoDto,
      );

    return {
      coinInfo,
      coinName,
      coinCode: getDiscussionRoomInfoDto.coinCode,
      posts,
    };
  }

  @Get('post')
  @Render('discussion-room-post')
  async discussionRoomPostPage(
    @Query() discussionRoomPostPageInfoDto: DiscussionRoomPostPageInfoDto,
  ) {
    const { coinCode, coinName } = discussionRoomPostPageInfoDto;
    return {
      coinCode,
      coinName,
    };
  }

  @Post('post')
  async createDiscussionRoomPost(
    @Body() createDiscussionRoomPostDto: CreateDiscussionRoomPostDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const post = await this.discussionRoomService.createDiscussionRoomPost(
      createDiscussionRoomPostDto,
      req,
    );
    res.redirect(`/discussion-room?coinCode=${post.coin_code}`);
  }

  @Post('post/reply')
  async createPostReply(
    @Body() createPostReplyDto: CreatePostReplyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const post = await this.discussionRoomService.createPostReply(
      createPostReplyDto,
      req,
    );
    res.redirect(`/discussion-room/post/${createPostReplyDto.postId}`);
  }

  @Post('post/reply/reply')
  async createPostReplyReply(
    @Body() createPostReplyReplyDto: CreatePostReplyReplyDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const postReplyReply =
      await this.discussionRoomService.createPostReplyReply(
        createPostReplyReplyDto,
        req,
      );
    res.redirect(
      `/discussion-room/post/${postReplyReply.parent_reply.post_id}`,
    );
  }

  @Get('post/:id')
  @Render('discussion-room-post-detail')
  async getDiscussionRoomPostDetailPage(@Param('id') id: number) {
    try {
      const post =
        await this.discussionRoomService.getDiscussionRoomPostDetail(id);
      return {
        post,
      };
    } catch (error) {
      return { post: null };
    }
  }
}
