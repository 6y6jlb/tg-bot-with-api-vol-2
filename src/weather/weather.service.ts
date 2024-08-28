import { Injectable } from '@nestjs/common';
import { WeatherClient } from './weather.client';
import { GetWeatherRequestDto } from './dto/get-weather-request.dto';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherClient: WeatherClient) {}

  async getWeather(getWeatherRequestDto: GetWeatherRequestDto) {
    return await this.weatherClient.get(getWeatherRequestDto);
  }
}
