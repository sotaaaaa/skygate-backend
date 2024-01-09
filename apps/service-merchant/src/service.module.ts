import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-merchant/service.config.yaml',
      envFilePath: 'apps/service-merchant/.env',
    }),
    MerchantModule,
  ],
})
export class ServiceModule {}
