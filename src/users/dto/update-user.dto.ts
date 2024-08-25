import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Schema } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto, {
  skipNullProperties: false,
}) {
  _id?: Schema.Types.ObjectId;
}
