import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Render,
} from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { GetMarketInfoDto } from './dto/get-market-info.dto';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @Render('market-info')
  async marketInfo(@Query() getMarketInfoDto: GetMarketInfoDto) {
    const { marketName, coinInfo, paginationNum, page, currency } =
      await this.marketService.getMarketInfo(getMarketInfoDto);
    return {
      marketName,
      coinInfo,
      paginationNum,
      page,
      currency,
    };
  }
}
