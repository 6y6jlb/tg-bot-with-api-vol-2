import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, TokensModule, ConfigModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
