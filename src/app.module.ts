import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from './tokens/tokens.module';
import { WeatherModule } from './weather/weather.module';
import { ExchangeModule } from './exchange/exchange.module';
import { RandomModule } from './random/random.module';
import { TasksModule } from './tasks/tasks.module';
import { MeModule } from './me/me.module';
import { TelegramModule } from './telegram/telegram.module';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => {
        return {
          uri: `mongodb+srv://${configService.getOrThrow<string>('MONGO_ATLAS_USER')}:${configService.getOrThrow<string>('MONGO_ATLAS_PASS')}@${configService.getOrThrow<string>('MONGO_ATLAS_NAME')}.n2dmfie.mongodb.net/?retryWrites=true&w=majority`,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    JwtModule.register({
      global: true,
    }),
    TokensModule,
    WeatherModule,
    ExchangeModule,
    RandomModule,
    TasksModule,
    MeModule,
    TelegramModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
  ],
})
export class AppModule {}
