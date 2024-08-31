import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IDogImage } from '../types/dog.types';

@Injectable()
export class DogClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getImage(): Promise<string> {
    const url = new URL(
      `${this.configService.get<string>('DOG_BASE_URL')}/woof.json`,
    );

    const response = await firstValueFrom(
      this.httpService.get<IDogImage>(url.toString(), {
        method: 'GET',
        headers: {
          cache: 'no-cache',
          credentials: 'same-origin',
          'Content-Type': 'application/json',
        },
      }),
    );

    console.log('Dog successful request.');

    return response.data?.url;
  }
}
