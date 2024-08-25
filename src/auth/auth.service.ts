import {
  Dependencies,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto);
    if (this.validateUserPassword(user, signInDto.password)) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync({
        email: user.email,
        telegram_id: user.telegram_id,
        _id: user._id,
      }),
    };
  }

  private validateUserPassword(user?: User, password?: string) {
    if (!(user && password)) {
      return false;
    }

    const hash = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);
    return user.hash === hash;
  }
}
