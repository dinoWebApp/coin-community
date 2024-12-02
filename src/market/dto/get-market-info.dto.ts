import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Currency } from 'src/common/enums/currency.enum';

export class GetMarketInfoDto {
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  page?: string;
}
