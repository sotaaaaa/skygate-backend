import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-payment-gateway/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-payment-gateway/.env',
      serviceName: 'ServicePaymentGateway',
    }),
  ],
})
export class ServiceModule {}
