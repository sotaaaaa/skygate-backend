import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';
import { PingServiceModule } from './ping-service/ping-service.module';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-order/service.config.yaml',
      envFilePath: 'apps/service-order/.env',
    }),
    PingServiceModule,
  ],
})
export class ServiceModule {}
