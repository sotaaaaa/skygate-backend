import { Module } from '@nestjs/common';
import { ServiceResourceController } from './service-resource.controller';
import { ServiceResourceService } from './service-resource.service';

@Module({
  imports: [],
  controllers: [ServiceResourceController],
  providers: [ServiceResourceService],
})
export class ServiceResourceModule {}
