import { PermissionModule } from '../permisson/permission.module';
import { RefreshTokenModule } from './../refresh-token/refresh-token.module';
import { MerchantAuthService } from '../auth/merchant.auth';
import { AuthMerchantDocument, AuthMerchantSchema } from './schemas/merchant.schema';
import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AuthMerchantDocument.name, schema: AuthMerchantSchema }],
      'DB_AUTH',
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('configs.jwt_secret'),
        signOptions: {
          expiresIn: configService.get<number>('configs.jwt_token_expires_in'),
        },
      }),
      inject: [ConfigService],
    }),
    RefreshTokenModule,
    PermissionModule,
  ],
  controllers: [MerchantController],
  providers: [MerchantService, MerchantAuthService],
  exports: [MerchantService],
})
export class MerchantModule {}
