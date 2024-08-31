import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RandomService } from './random.service';

@Controller('random')
export class RandomController {
  constructor(private readonly randomService: RandomService) {}

  @Get('image')
  @HttpCode(HttpStatus.OK)
  image() {
    return this.randomService.getImage();
  }
}
