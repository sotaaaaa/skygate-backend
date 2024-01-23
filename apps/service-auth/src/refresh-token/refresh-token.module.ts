import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenController } from './refresh-token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MerchantRefreshTokenDocument,
  MerchantRefreshTokenSchema,
} from './schemas/merchant-refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: MerchantRefreshTokenDocument.name, schema: MerchantRefreshTokenSchema }],
      'DB_AUTH',
    ),
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
