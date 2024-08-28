import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  IOpeneXChangeRatesCurrencies,
  IOpeneXChangeRatesLatest,
} from './exchange.types';

@Injectable()
export class ExchangeClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get(base: string = 'USD'): Promise<IOpeneXChangeRatesLatest> {
    const url = new URL(
      `${this.configService.get<string>('OPEN_XHANGE_RATE_BASE_URL')}/latest.json`,
    );

    console.log(url.toString());

    url.searchParams.append(
      'app_id',
      this.configService.get<string>('OPEN_XCHANGE_API_KEY'),
    );
    url.searchParams.append('base', base);

    const response = await firstValueFrom(
      this.httpService.get<IOpeneXChangeRatesLatest>(url.toString(), {
        method: 'GET',
        headers: {
          cache: 'no-cache',
          credentials: 'same-origin',
          'Content-Type': 'application/json',
        },
      }),
    );

    console.log('XRate successful request.');

    return response.data;
  }

  async getCurrencies(): Promise<IOpeneXChangeRatesCurrencies> {
    const url = new URL(
      `${this.configService.get<string>('OPEN_XHANGE_RATE_BASE_URL')}/currencies.json`,
    );

    url.searchParams.append(
      'app_id',
      this.configService.get<string>('OPEN_XCHANGE_API_KEY'),
    );

    const response = await firstValueFrom(
      this.httpService.get<IOpeneXChangeRatesCurrencies>(url.toString(), {
        headers: {
          cache: 'no-cache',
          credentials: 'same-origin',
          'Content-Type': 'application/json',
        },
      }),
    );

    console.log('List of currencies successful request.');

    return response.data;
  }
}
