import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EVENT_ENUM } from 'src/common/const';

export class OptionDto {
  @IsEnum(EVENT_ENUM)
  event_type: EVENT_ENUM;

  @IsOptional()
  @IsString()
  param?: string;
}
