import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TokenError } from 'src/exceptions/Token';
import { Model } from 'mongoose';
import { GetTokenDto } from './dto/get-token.dto';
import { Token } from './entities/token.entity';
import { StoreTokenDto } from './dto/store-token.dto';
import { RemoveTokenDto } from './dto/remove-token.dto';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  async get(getTokenDto: GetTokenDto) {
    if (getTokenDto.user_id && getTokenDto.token_type) {
      return await this.tokenModel.findOne(getTokenDto);
    }
    throw new TokenError(
      'Token can not be find, data incorrect: ' + JSON.stringify(getTokenDto),
    );
  }

  async store(storeTokenDto: StoreTokenDto) {
    if (storeTokenDto.user_id && storeTokenDto.token_type) {
      await this.delete({
        user_id: storeTokenDto.user_id,
        token_type: storeTokenDto.token_type,
      });
      return await this.tokenModel.create(storeTokenDto);
    }
    throw new TokenError(
      'Token can not be stored, data incorrect: ' +
        JSON.stringify(storeTokenDto),
    );
  }

  async delete(removeTokenDto: RemoveTokenDto) {
    if (removeTokenDto.user_id && removeTokenDto.token_type) {
      return await this.tokenModel.findOneAndDelete(removeTokenDto);
    }
    throw new TokenError(
      'Token can not be removed, data incorrect: ' +
        JSON.stringify(removeTokenDto),
    );
  }
}
