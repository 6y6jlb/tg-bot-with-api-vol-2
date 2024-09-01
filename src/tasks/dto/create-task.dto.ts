import { Type } from 'class-transformer';
import {
  IsOptional,
  IsDate,
  IsMongoId,
  IsArray,
  IsString,
  IsBoolean,
} from 'class-validator';
import { OptionDto } from './option.dto';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  last_call?: Date;

  @IsMongoId()
  user_id: Types.ObjectId;

  @IsArray()
  @Type(() => OptionDto)
  options: Array<OptionDto>;

  @IsString()
  call_at: string;

  @IsOptional()
  @IsBoolean()
  queue?: boolean;

  @IsString()
  tz: string;

  @IsBoolean()
  is_regular: boolean;
}
