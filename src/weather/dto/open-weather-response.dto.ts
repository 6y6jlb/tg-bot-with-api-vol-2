export class OpenWeatherResponseDto {
  coord: {
    lon: number; // 10.99,
    lat: number; // 44.34
  };
  weather: [
    {
      id: number; // 501,
      main: string; // "Rain",
      description: string; // "moderate rain",
      icon: string; // "10d"
    },
  ];
  base: string; // "stations",
  main: {
    temp: number; // 298.48,
    feels_like: number; // 298.74,
    temp_min: number; //  297.56,
    temp_max: number; // 300.05,
    pressure: number; // 1015,
    humidity: number; // 64,
    sea_level: number; // 1015,
    grnd_level: number; // 933
  };
  visibility: number; // 10000,
  wind: {
    speed: number; // 0.62,
    deg: number; // 349,
    gust: number; // 1.18
  };
  rain: {
    '1h': number; // 3.16
  };
  clouds: {
    all: number; // 100
  };
  dt: Date; //1661870592,
  sys: {
    type: number; // 2,
    id: number; // 2075663,
    country: string; // "IT",
    sunrise: Date; // 1661834187,
    sunset: Date; // 1661882248
  };
  timezone: number; // 7200,
  id: number; // 3163858,
  name: string; // "Zocca",
  cod: number; // 200
}
