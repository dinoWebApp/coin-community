import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetDiscussionRoomInfoDto } from './dto/get-discussion-room-info.dto';
import { Currency } from 'src/common/enums/currency.enum';
import { CreateDiscussionRoomPostDto } from './dto/create-discussion-room-post.dto';
import { Request } from 'express';
import { DateTime } from 'luxon';
import { Prisma } from '@prisma/client';
import { CreatePostReplyDto } from './dto/create-post-reply';

@Injectable()
export class DiscussionRoomService {
  constructor(private readonly prisma: PrismaService) {}
  async getDiscussionRoomInfo(
    getDiscussionRoomInfoDto: GetDiscussionRoomInfoDto,
  ) {
    const { coinCode } = getDiscussionRoomInfoDto;
    const coinInfoData = await this.prisma.coins.findMany({
      where: {
        market_code: {
          endsWith: coinCode,
        },
      },
    });

    const coinName = coinInfoData[0].korean_name;

    const coinInfo = coinInfoData.map((coin) => {
      const {
        currency,
        trade_price,
        high_price,
        low_price,
        signed_change_rate,
      } = coin;
      if (coin.currency !== Currency.BTC) {
        return {
          currency,
          trade_price: Number(trade_price).toLocaleString(),
          high_price: Number(high_price).toLocaleString(),
          low_price: Number(low_price).toLocaleString(),
          signed_change_rate: Number(signed_change_rate).toFixed(2),
        };
      } else {
        return {
          currency,
          trade_price: Number(trade_price),
          high_price: Number(high_price),
          low_price: Number(low_price),
          signed_change_rate: Number(signed_change_rate).toFixed(2),
        };
      }
    });

    const postData = await this.prisma.discussion_room_posts.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });

    const posts = postData.map((post) => {
      const timestamp = post.timestamp;
      const postDateTime = DateTime.fromFormat(
        timestamp,
        'yyyy-MM-dd HH:mm:ss',
      );
      const postDate = postDateTime.toFormat('yyyy-MM-dd');
      const now = DateTime.now().setZone('Asia/Seoul');
      const nowDate = now.toFormat('yyyy-MM-dd');
      let date = '';
      if (postDate === nowDate) {
        date = postDateTime.toFormat('HH:mm');
      } else if (postDateTime.year === now.year) {
        date = postDateTime.toFormat('MM.dd');
      } else {
        date = postDateTime.toFormat('yy/MM/dd');
      }
      return {
        id: post.id,
        title: post.title,
        userName: post.user_name,
        date: date,
        views: post.views,
        likes: post.likes,
      };
    });

    return {
      coinInfo,
      coinName,
      posts,
    };
  }

  async createDiscussionRoomPost(
    createDiscussionRoomPostDto: CreateDiscussionRoomPostDto,
    req: Request,
  ) {
    const { title, content, userName, password, coinCode, coinName } =
      createDiscussionRoomPostDto;

    const ip = this.getShortenIPv4(req.ip);
    // if (isMember) {
    //   const user = await this.prisma.users.findUnique({
    //     where: {
    //       user_name: userName,
    //     },
    //   });

    //   if (!user) throw new UnauthorizedException();
    // }

    try {
      const timestamp = DateTime.now()
        .setZone('Asia/Seoul')
        .toFormat('yyyy-MM-dd HH:mm:ss');
      const post = await this.prisma.discussion_room_posts.create({
        data: {
          title: title,
          content: content,
          user_name: userName,
          password: password,
          is_member: false,
          coin_code: coinCode,
          coin_name: coinName,
          timestamp: timestamp,
          ip: ip,
        },
        select: {
          id: true,
          coin_code: true,
          coin_name: true,
        },
      });
      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createPostReply(createPostReplyDto: CreatePostReplyDto, req: Request) {
    const { content, userName, password, postId } = createPostReplyDto;
    const ip = this.getShortenIPv4(req.ip);
    // if (isMember) {
    //   const user = await this.prisma.users.findUnique({
    //     where: {
    //       user_name: userName,
    //     },
    //   });

    //   if (!user) throw new UnauthorizedException();
    // }

    try {
      const timestamp = DateTime.now()
        .setZone('Asia/Seoul')
        .toFormat('yyyy-MM-dd HH:mm:ss');
      const post = await this.prisma.discussion_room_replies.create({
        data: {
          content: content,
          user_name: userName,
          password: password,
          post_id: postId,
          timestamp: timestamp,
        },
      });
      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getDiscussionRoomPostDetail(id: number) {
    try {
      const post = await this.prisma.discussion_room_posts.update({
        where: {
          id: id,
        },
        data: {
          views: {
            increment: 1,
          },
        },
        select: {
          title: true,
          content: true,
          user_name: true,
          views: true,
          likes: true,
          timestamp: true,
          coin_name: true,
          replies: true,
        },
      });
      return post;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error(`Post with ID ${id} not found`);
      }
      throw error;
    }
  }

  getShortenIPv4(ip: string) {
    const fullIp = ip.includes('::ffff:') ? ip.split('::ffff:')[1] : ip;
    const ipArr = fullIp.split('.');
    const shortenIp = `${ipArr[0]}.${ipArr[1]}`;
    return shortenIp;
  }
}
