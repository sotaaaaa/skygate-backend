import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-payment-qr/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-payment-qr/.env',
      serviceName: 'ServicePaymentQr',
    }),
  ],
})
export class ServiceModule {}
