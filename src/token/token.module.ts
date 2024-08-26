import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';
import { TokenSchema } from 'src/schemas/token.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
})
export class TokenModule {}
