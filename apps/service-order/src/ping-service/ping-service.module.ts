import { Module } from '@nestjs/common';
import { PingServiceController } from './ping-service.controller';
import { PingServiceService } from './ping-service.service';

@Module({
  controllers: [PingServiceController],
  providers: [PingServiceService]
})
export class PingServiceModule {}
