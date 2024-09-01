import { Module } from '@nestjs/common';
import { TokensService as TokensService } from './tokens.service';
import { Token as Tokens } from './entities/tokens.entity';
import { TokenSchema } from 'src/schemas/token.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [TokensService],
  exports: [TokensService],
  imports: [
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokenSchema }]),
  ],
})
export class TokensModule {}
