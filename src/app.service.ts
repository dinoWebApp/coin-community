import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {}
  @Cron('*/1 * * * *')
  async updateCoinInfo() {
    const apiUrl = this.configService.get<string>('COIN_API_URL');
    console.log('Start:', new Date());

    try {
      // 1. API 호출
      const marketsResponse = await axios.get(`${apiUrl}/market/all`);
      const markets = marketsResponse.data;
      const marketCodes = markets.map((market) => market.market).join(',');

      // 2. 가격 정보 가져오기
      const pricesResponse = await axios.get(`${apiUrl}/ticker`, {
        params: { markets: marketCodes },
      });
      const prices = pricesResponse.data;

      // 3. 데이터 매핑
      const marketsWithPrices = prices.map((price) => {
        const marketName = markets.find(
          (marketInfo) => marketInfo.market === price.market,
        );
        const currency = price.market.startsWith('USDT-')
          ? 'USDT'
          : price.market.startsWith('KRW-')
            ? 'KRW'
            : 'BTC';
        const trade_datetime = DateTime.fromMillis(price.trade_timestamp, {
          zone: 'utc',
        })
          .setZone('Asia/Seoul')
          .toJSDate();
        return {
          market_code: price.market,
          currency,
          korean_name: marketName.korean_name,
          english_name: marketName.english_name,
          prev_closing_price: price.prev_closing_price,
          opening_price: price.opening_price,
          high_price: price.high_price,
          low_price: price.low_price,
          trade_price: price.trade_price,
          signed_change_price: price.signed_change_price,
          signed_change_rate: price.signed_change_rate,
          trade_datetime,
        };
      });

      // 4. 트랜잭션을 사용하여 일괄 저장
      await this.prisma.$transaction(
        marketsWithPrices.map((coin) =>
          this.prisma.coins.upsert({
            where: { market_code: coin.market_code },
            update: {
              currency: coin.currency,
              korean_name: coin.korean_name,
              english_name: coin.english_name,
              prev_closing_price: coin.prev_closing_price,
              opening_price: coin.opening_price,
              high_price: coin.high_price,
              low_price: coin.low_price,
              trade_price: coin.trade_price,
              signed_change_price: coin.signed_change_price,
              signed_change_rate: coin.signed_change_rate,
              trade_datetime: coin.trade_datetime,
            },
            create: coin,
          }),
        ),
      );

      console.log('Update coin info complete:', new Date());
    } catch (error) {
      console.error('API 호출 또는 DB 업데이트 중 오류 발생:', error);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}