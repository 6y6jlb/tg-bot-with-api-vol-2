import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MoongooseSchema } from 'mongoose';
import { TOKEN_TYPE } from 'src/common/const';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
export class Token extends Document {
  @Prop({ type: MoongooseSchema.Types.ObjectId, ref: User.name })
  user_id?: number;

  @Prop({ type: String, required: true, default: TOKEN_TYPE.REFRESH })
  token_type?: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
