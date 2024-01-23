import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-tms/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-tms/.env',
      serviceName: 'ServiceTms',
    }),
  ],
})
export class ServiceModule {}
