import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetDiscussionRoomInfoDto } from './dto/get-discussion-room-info.dto';
import { Currency } from 'src/common/enums/currency.enum';

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

    return {
      coinInfo,
      coinName,
    };
  }
}
