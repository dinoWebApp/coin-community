import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { DateTime } from 'luxon';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  @Cron('*/1 * * * *')
  async updateCoinInfo() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd',
      );
      const data = response.data;

      for (const coin of data) {
        const lastUpdated = DateTime.fromISO(coin.last_updated, { zone: 'utc' })
          .setZone('Asia/Seoul')
          .toISO();
        await this.prisma.coins.upsert({
          where: {
            id: coin.id,
          },
          update: {
            symbol: coin.symbol,
            name: coin.name,
            img_url: coin.image,
            current_price: coin.current_price,
            market_cap_rank: coin.market_cap_rank,
            high_24h: coin.high_24h,
            low_24h: coin.low_24h,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            last_updated: lastUpdated,
          },
          create: {
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            img_url: coin.image,
            current_price: coin.current_price,
            market_cap_rank: coin.market_cap_rank,
            high_24h: coin.high_24h,
            low_24h: coin.low_24h,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            last_updated: lastUpdated,
          },
        });
      }
      console.log('Update coin info complete');
    } catch (error) {
      console.error('API 호출 또는 DB 업데이트 중 오류 발생:', error);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
