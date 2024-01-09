import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-merchant/service.config.yaml',
      envFilePath: 'apps/service-merchant/.env',
    }),
  ],
})
export class ServiceModule {}
