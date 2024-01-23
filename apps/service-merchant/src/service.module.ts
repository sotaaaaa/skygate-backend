import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-merchant/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-merchant/.env',
      serviceName: 'ServiceMerchant',
    }),
    MerchantModule,
  ],
})
export class ServiceModule {}
