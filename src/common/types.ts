import { Schema, Document } from 'mongoose';
import { APP_TYPE_ENUM, EVENT_ENUM, ROLE, TOKEN_TYPE } from './const';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  telegram_id?: number | string;
  email?: string;
  created_at: Date;
  name: string;
  role: ROLE;
  tz?: string;
  location?: string;
  currency?: string;
  locale?: string;
  hash?: string;
  salt?: string;
  validatePassword?: (password: string) => boolean;
  update?: (data: { [key: string]: any }, params?: any) => any;
  toJson?: () => JSON;
}

export interface ITask {
  _id?: Schema.Types.ObjectId;
  last_call?: Date;
  user_id: Schema.Types.ObjectId;
  options: Array<IOption>;
  call_at: string;
  queue?: boolean;
  tz: string;
  is_regular: boolean;
}

export interface IUserSettings {
  _id?: Schema.Types.ObjectId;
  created_at: Date;
  user_id: Schema.Types.ObjectId;
  app_type: APP_TYPE_ENUM;
  payload?: ISettingPayload;
}

export interface ISettingPayload {
  task_id?: Schema.Types.ObjectId;
}

export interface IOption {
  event_type: EVENT_ENUM;
  param: string;
}

export interface IToken {
  _id?: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  token_type: TOKEN_TYPE;
}
