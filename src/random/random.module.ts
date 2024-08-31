import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { RandomController } from './random.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CatClient } from './clients/cat.client';
import { DogClient } from './clients/dog.client';
import { FoxClient } from './clients/fox.client';

@Module({
  controllers: [RandomController],
  providers: [RandomService, CatClient, DogClient, FoxClient],
  imports: [HttpModule, ConfigModule.forRoot()],
})
export class RandomModule {}
