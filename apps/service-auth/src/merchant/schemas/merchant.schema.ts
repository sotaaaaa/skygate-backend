import { MerchantStatus } from '../types/merchant.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'merchants' })
export class AuthMerchantDocument extends Document {
  @Prop({ required: true, type: String, index: true, unique: true })
  code: string;

  @Prop({ required: true, type: String, index: true, unique: true })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  // Các thông tin thêm như email, phone, ...
  // Sau này có thể thêm điều kiện đăng nhập bằng email, phone, ...
  @Prop({ type: String, index: true })
  email?: string;

  @Prop({ type: String, index: true })
  phone?: string;

  @Prop({ required: true, type: [String], default: [] })
  roles: string[];

  @Prop({
    required: true,
    type: String,
    enum: MerchantStatus,
    default: MerchantStatus.ACTIVE,
  })
  status: MerchantStatus;
}

export const AuthMerchantSchema = SchemaFactory.createForClass(AuthMerchantDocument);
