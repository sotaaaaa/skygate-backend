import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-order/service.config.yaml',
      envFilePath: 'apps/service-order/.env',
    }),
  ],
})
export class ServiceModule {}
