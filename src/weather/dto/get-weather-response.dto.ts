import { OpenWeatherResponseDto } from './open-weather-response.dto';

export class GetWeatherResponseDto extends OpenWeatherResponseDto {
  units: string;
  lang: string;
  icon: string;
  city: string;
}
