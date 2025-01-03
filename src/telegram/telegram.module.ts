import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { WeatherScene } from './scenes/weather.scene';
import { session } from 'telegraf';
import { WeatherService } from 'src/weather/weather.service';
import { WeatherClient } from 'src/weather/weather.client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('TG_BOT_API_KEY'),
        middlewares: [session()],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TelegramService,
    TelegramUpdate,
    WeatherScene,
    WeatherService,
    WeatherClient,
  ],
})
export class TelegramModule {}
