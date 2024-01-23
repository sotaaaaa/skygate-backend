import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-bill/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-bill/.env',
      serviceName: 'ServiceBill',
    }),
  ],
})
export class ServiceModule {}
