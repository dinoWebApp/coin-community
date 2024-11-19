import { Injectable } from '@nestjs/common';
import { getMarketInfoDto } from './dto/get-market-info.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Currency } from 'src/common/enums/currency.enum';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService) {}
  async getMarketInfo(getMarketInfoDto: getMarketInfoDto) {
    const { currency, page = 1 } = getMarketInfoDto;
    const pagination = 40 * (Number(page) - 1);

    let marketName: string;

    if (currency === Currency.KRW) {
      marketName = '원화';
    } else {
      marketName = currency;
    }

    //페이지네이션 페이지마다 40개 데이터
    const coinInfoData = await this.prisma.coins.findMany({
      where: {
        currency: currency,
      },
      orderBy: {
        trade_price: 'desc',
      },
      skip: pagination,
      take: 40,
    });

    let coinInfo = [];
    if (currency === Currency.BTC) {
      coinInfo = coinInfoData.map((coin) => {
        const {
          market_code,
          trade_price,
          prev_closing_price,
          opening_price,
          high_price,
          low_price,
          signed_change_rate,
          ...etc
        } = coin;
        const coinInfo = {
          market_code: market_code.split('-')[1],
          trade_price: Number(trade_price),
          prev_closing_price: Number(prev_closing_price),
          opening_price: Number(opening_price),
          high_price: Number(high_price),
          low_price: Number(low_price),
          signed_change_rate: (Number(signed_change_rate) * 100).toFixed(2),
          ...etc,
        };
        return coinInfo;
      });
    } else {
      coinInfo = coinInfoData.map((coin) => {
        const {
          market_code,
          trade_price,
          prev_closing_price,
          opening_price,
          high_price,
          low_price,
          signed_change_rate,
          ...etc
        } = coin;
        const coinInfo = {
          market_code: market_code.split('-')[1],
          trade_price: Number(trade_price).toLocaleString(),
          prev_closing_price: Number(prev_closing_price).toLocaleString(),
          opening_price: Number(opening_price).toLocaleString(),
          high_price: Number(high_price).toLocaleString(),
          low_price: Number(low_price).toLocaleString(),
          signed_change_rate: (Number(signed_change_rate) * 100).toFixed(2),
          ...etc,
        };
        return coinInfo;
      });
    }

    const totalCount = await this.prisma.coins.count({
      where: {
        currency: {
          startsWith: currency,
        },
      },
    });

    const paginationNum = Math.ceil(totalCount / 40);

    return {
      marketName,
      coinInfo,
      paginationNum,
      page,
      currency,
    };
  }
}
