import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-resource/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-resource/.env',
      serviceName: 'ServiceResource',
    }),
  ],
})
export class ServiceModule {}
