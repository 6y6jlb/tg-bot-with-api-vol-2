import {
  Dependencies,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { TOKEN_TYPE } from 'src/common/const';
import { User } from 'src/schemas/user.schema';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Dependencies(UsersService, JwtService, TokenService)
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto);
    if (!this.validateUserPassword(user, signInDto.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      email: user.email || '',
      telegram_id: user.telegram_id || '',
      _id: user._id,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '5m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: '7d',
    });

    await this.tokenService.store({
      user_id: user._id,
      token_type: TOKEN_TYPE.REFRESH,
      token: refreshToken,
    });

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
          secret: process.env.JWT_SECRET_KEY,
        },
      );

      const storedRefreshToken = await this.tokenService.get({ ...payload });

      if (!storedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findOne({ ...payload });

      const accessToken = await this.jwtService.signAsync(
        {
          email: user.email,
          telegram_id: user.telegram_id,
          _id: user._id,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '5m',
        },
      );

      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }

  // Logout Method
  // async logout(user: IUser) {
  //   if (user._id) {
  //     await this.usersService.logout({ _id: user._id });
  //   }
  // }

  // // Store User Method
  // async storeUser(createUserDto: any) {
  //   try {
  //     const user = await this.usersService.store(createUserDto);
  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException('Failed to create user');
  //   }
  // }

  // // Reset Password Method
  // async resetPassword(resetPasswordDto: any) {
  //   try {
  //     const user = await this.usersService.resetPassword(resetPasswordDto);
  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException('Failed to reset password');
  //   }
  // }
}
