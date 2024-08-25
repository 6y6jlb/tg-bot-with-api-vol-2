import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';
import { ROLE } from 'src/common/const';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Number, required: false, unique: true })
  telegram_id?: number;

  @Prop({ type: String, required: false, unique: true })
  email?: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: String, required: false, unique: false })
  name?: string;

  @Prop({
    type: [String],
    enum: Object.values(ROLE),
    default: [ROLE.CUSTOMER],
  })
  roles: ROLE[];

  @Prop({ type: String, required: false })
  tz?: string;

  @Prop({ type: String, required: false })
  location?: string;

  @Prop({ type: String, required: false })
  currency?: string;

  @Prop({ type: String, required: false })
  locale?: string;

  @Prop({ type: String })
  hash: string;

  @Prop({ type: String })
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!(this.roles && this.roles.length)) {
    this.roles = [ROLE.CUSTOMER];
  }

  if (!this.email && !this.telegram_id) {
    next(new Error('Either email or telegram_id must be set'));
  } else {
    next();
  }
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('hash')) return next();

  crypto.randomBytes(16, (err, salt) => {
    if (err) return next(err);

    this.salt = salt.toString('hex');
    crypto.pbkdf2(this.hash, this.salt, 1000, 64, 'sha512', (err, hash) => {
      if (err) return next(err);

      this.hash = hash.toString('hex');
      next();
    });
  });
});
