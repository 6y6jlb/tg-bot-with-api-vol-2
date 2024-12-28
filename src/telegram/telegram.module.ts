import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { WeatherScene } from './scenes/weather.scene';
import { session } from 'telegraf';

@Module({
  imports: [
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
  providers: [TelegramService, TelegramUpdate, WeatherScene],
})
export class TelegramModule {}
