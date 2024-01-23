import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'merchant-refresh-tokens' })
export class MerchantRefreshTokenDocument extends Document {
  @Prop({ required: true, type: String, index: true })
  code: string;

  @Prop({ default: false, type: Boolean })
  isRevoked: boolean;

  @Prop({ required: true })
  expires: Date;
}

export const MerchantRefreshTokenSchema = SchemaFactory.createForClass(
  MerchantRefreshTokenDocument,
);
