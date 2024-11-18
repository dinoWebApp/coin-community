import { IsEnum, IsNotEmpty } from 'class-validator';
import { Currency } from 'src/common/enums/currency.enum';

export class getMarketInfoDto {
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsNotEmpty()
  page: string;
}
