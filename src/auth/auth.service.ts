import {
  Dependencies,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Schema } from 'mongoose';
import { TOKEN_TYPE } from 'src/common/const';
import { User } from 'src/schemas/user.schema';
import { StoreTokenDto } from 'src/tokens/dto/store-token.dto';
import { TokensService } from '../tokens/tokens.service';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';

@Dependencies(UsersService, JwtService, TokensService, ConfigService)
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokensService,
    private configService: ConfigService,
  ) { }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto.id);
    if (!this.validateUserPassword(user, signInDto.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: user.email || '',
      telegram_id: user.telegram_id || '',
      _id: user._id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: '5m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: '7d',
    });

    await this.tokenService.store({
      user_id: user._id,
      token_type: TOKEN_TYPE.REFRESH,
      token: refreshToken,
    } as StoreTokenDto);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private validateUserPassword(user?: User, password?: string) {
    if (!user || !password) {
      return false;
    }

    const hash = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return user.hash === hash;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refresh_token,
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        },
      );

      const storedRefreshToken = await this.tokenService.get(payload);

      if (!storedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findOne(
        payload._id || payload.email || payload.telegram_id,
      );

      const accessToken = await this.jwtService.signAsync(
        {
          email: user.email,
          telegram_id: user.telegram_id,
          _id: user._id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: '5m',
        },
      );

      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logout(userId: Schema.Types.ObjectId) {
    if (!userId) {
      return;
    }

    await this.tokenService.delete({
      user_id: userId,
      token_type: TOKEN_TYPE.REFRESH,
    });
  }
}
