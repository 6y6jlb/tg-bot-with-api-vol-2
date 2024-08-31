import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IFoxImage } from '../types/fox.types';

@Injectable()
export class FoxClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getImage(): Promise<string> {
    const url = new URL(
      `${this.configService.get<string>('FOX_BASE_URL')}/floof`,
    );

    const response = await firstValueFrom(
      this.httpService.get<IFoxImage>(url.toString(), {
        method: 'GET',
        headers: {
          cache: 'no-cache',
          credentials: 'same-origin',
          'Content-Type': 'application/json',
        },
      }),
    );

    console.log('Fox successful request.');

    return response.data?.link;
  }
}
