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

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGO_ATLAS_USER')}:${configService.get('MONGO_ATLAS_PASS')}@${configService.get('MONGO_ATLASS_NAME')}.n2dmfie.mongodb.net/?retryWrites=true&w=majority`,
      }),
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
  ],
})
export class AppModule { }
