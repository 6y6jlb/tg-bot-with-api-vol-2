import { IntersectionType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UserIdDto } from './user-dto';

export class UpdateUserDto extends IntersectionType(UserIdDto, CreateUserDto) {}
