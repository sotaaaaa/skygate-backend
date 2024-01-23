import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'merchant-roles' })
export class MerchantRoleDocument extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: [String], default: [] })
  permissions: string[];

  @Prop({ required: true, type: String })
  depscription: string;

  @Prop({ required: true, type: Boolean, default: true })
  isActive: boolean;
}

export const MerchantRoleSchema = SchemaFactory.createForClass(MerchantRoleDocument);
