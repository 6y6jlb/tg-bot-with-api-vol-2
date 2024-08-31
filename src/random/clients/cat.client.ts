import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ICatImage } from '../types/cat.types';

@Injectable()
export class CatClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getImage(): Promise<string> {
    const url = new URL(
      `${this.configService.get<string>('CAT_BASE_URL')}/images/search`,
    );

    const response = await firstValueFrom(
      this.httpService.get<ICatImage[]>(url.toString(), {
        method: 'GET',
        headers: {
          cache: 'no-cache',
          credentials: 'same-origin',
          'Content-Type': 'application/json',
        },
      }),
    );

    console.log('Cat successful request.');

    return response.data[0]?.url;
  }
}
