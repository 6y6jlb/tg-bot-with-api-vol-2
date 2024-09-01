import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class DeleteTaskDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  user_id?: Types.ObjectId;
}
