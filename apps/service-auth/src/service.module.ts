import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';
import { MerchantModule } from './merchant/merchant.module';
import { PermissionModule } from './permisson/permission.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-auth/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-auth/.env',
      serviceName: "ServiceAuth"
    }),
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
    MerchantModule,
    PermissionModule,
    RefreshTokenModule,
  ],
})
export class ServiceModule {}
