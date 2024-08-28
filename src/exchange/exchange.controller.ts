import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { GetRateDto } from './dto/get-rate.dto';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @HttpCode(HttpStatus.OK)
  @Get('rate')
  getRate(@Query() getRateDto: GetRateDto) {
    return this.exchangeService.getRate(getRateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('currencies')
  getCurrencies() {
    return this.exchangeService.getCurrencies();
  }
}
