import { PartialType } from '@nestjs/mapped-types';
import { UserIdDto } from './user-dto';

export class CreateUserDto extends PartialType(UserIdDto, {}) {
  name: string;
  locale?: string;
  currency?: string;
  password?: string;
  location?: string;
  tz?: string;
}
