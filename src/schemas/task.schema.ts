import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MoongooseSchema } from 'mongoose';
import { EVENT_ENUM } from 'src/common/const';
import { User } from 'src/users/entities/user.entity';

export class Task extends Document {
  @Prop({ type: MoongooseSchema.Types.ObjectId, ref: User.name })
  user_id: MoongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: false })
  last_call?: Date;

  @Prop({
    type: [
      {
        event_type: { type: String, enum: EVENT_ENUM, required: true },
        param: { type: String, required: false },
      },
    ],
    required: true,
    default: [],
  })
  options: Array<{
    event_type: string;
    param?: string;
  }>;

  @Prop({ type: String, required: true })
  call_at: string;

  @Prop({ type: String, required: false, default: 'Europe/Moscow' })
  tz: string;

  @Prop({ type: Boolean, required: false, default: false })
  is_regular: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  queue: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
