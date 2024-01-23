import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-bank-connector/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-bank-connector/.env',
      serviceName: 'ServiceBankConnector',
    }),
  ],
})
export class ServiceModule {}
