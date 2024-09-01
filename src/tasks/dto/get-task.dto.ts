import { IsOptional, IsMongoId, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class GetTaskDto {
  @IsOptional()
  call_at?: any;

  @IsOptional()
  @IsBoolean()
  queue?: boolean;

  @IsOptional()
  @IsMongoId()
  user_id?: Types.ObjectId;
}
