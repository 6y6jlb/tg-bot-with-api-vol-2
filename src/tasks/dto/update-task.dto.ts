import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { OptionDto } from './option.dto';

export class UpdateTaskDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  user_id?: Types.ObjectId;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  last_call?: Date;

  @IsOptional()
  @IsArray()
  @Type(() => OptionDto)
  options?: Array<OptionDto>;

  @IsOptional()
  @IsString()
  call_at?: string;

  @IsOptional()
  @IsBoolean()
  queue?: boolean;

  @IsOptional()
  @IsString()
  tz?: string;

  @IsOptional()
  @IsBoolean()
  is_regular?: boolean;
}
