import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-system-configs/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-system-configs/.env',
      serviceName: 'ServiceSystemConfigs',
    }),
  ],
})
export class ServiceModule {}
