import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { GetWeatherRequestDto } from './dto/get-weather-request.dto';
import { GetWeatherResponseDto } from './dto/get-weather-response.dto';
import { OpenWeatherResponseDto } from './dto/open-weather-response.dto';

@Injectable()
export class WeatherClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get(
    getWeatherRequestDto: GetWeatherRequestDto,
  ): Promise<GetWeatherResponseDto> {
    if (!getWeatherRequestDto.city) {
      throw new BadRequestException();
    }

    const url = new URL(
      `${this.configService.get<string>('OPEN_WEATHER_BASE_URL')}/weather`,
    );

    url.searchParams.append(
      'appid',
      this.configService.get<string>('OPEN_WEATHER_API_KEY'),
    );
    url.searchParams.append('units', getWeatherRequestDto.units || 'metric');
    url.searchParams.append('lang', getWeatherRequestDto.lang || 'en');

    if (getWeatherRequestDto.city) {
      url.searchParams.append('q', getWeatherRequestDto.city);
    }

    try {
      const response: AxiosResponse<OpenWeatherResponseDto> =
        await firstValueFrom(
          this.httpService.get<OpenWeatherResponseDto>(url.toString(), {
            headers: {
              cache: 'no-cache',
              credentials: 'same-origin',
              'Content-Type': 'application/json',
            },
          }),
        );

      const data = response.data;

      console.log(
        `Weather for ${getWeatherRequestDto.city} successful request.`,
      );

      return {
        ...data,
        main: {
          ...data.main,
          pressure: this.pressureConverter(Number(data.main.pressure)),
        },
        icon: this.getIconUrl(data.weather[0].icon),
        units: getWeatherRequestDto.units || 'metric',
        lang: getWeatherRequestDto.lang || 'ru',
        city: getWeatherRequestDto.city,
      };
    } catch (e: any) {
      if (e.status === 404) {
        throw new NotFoundException(e.message);
      } else {
        throw new HttpException(e.message, e.status || 400);
      }
    }
  }

  private getIconUrl(value: string) {
    return `http://openweathermap.org/img/wn/${value}@4x.png`;
  }

  private pressureConverter(pressure: number): number {
    return pressure * 0.75006;
  }
}
