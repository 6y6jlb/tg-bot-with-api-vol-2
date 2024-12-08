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

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('MONGO_ATLAS_USER');
        const pass = configService.get<string>('MONGO_ATLAS_PASS');
        const name = configService.get<string>('MONGO_ATLAS_NAME');

        if (!user || !pass || !name) {
          throw new Error(
            'One or more MongoDB configuration variables are missing!',
          );
        }
        return {
          uri: `mongodb+srv://${user}:${pass}@${name}.n2dmfie.mongodb.net/?retryWrites=true&w=majority`,
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
  ],
})
export class AppModule {}
