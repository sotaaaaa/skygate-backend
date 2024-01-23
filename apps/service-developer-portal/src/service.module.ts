import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-developer-portal/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-developer-portal/.env',
      serviceName: 'ServiceDeveloperPortal',
    }),
  ],
})
export class ServiceModule {}
