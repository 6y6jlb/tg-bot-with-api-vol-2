import { Schema } from 'mongoose';
import { TOKEN_TYPE } from 'src/common/const';

export class GetTokenDto {
  user_id: Schema.Types.ObjectId;
  token_type: TOKEN_TYPE;
}
