import { Controller, Get, Query } from '@nestjs/common';
import { GetWeatherRequestDto } from './dto/get-weather-request.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query() getWeatherRequestDto: GetWeatherRequestDto) {
    return this.weatherService.getWeather(getWeatherRequestDto);
  }
}
