import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { ExchangeClient } from './exchange.client';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [ExchangeController],
  providers: [ExchangeService, ExchangeClient],
})
export class ExchangeModule {}
