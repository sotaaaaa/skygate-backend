import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-report/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-report/.env',
      serviceName: 'ServiceReport',
    }),
  ],
})
export class ServiceModule {}
