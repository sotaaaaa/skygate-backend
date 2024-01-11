import { Controller, Logger } from '@nestjs/common';
import { RemoteFuncToService } from '@skygate/core';
import {
  PingServiceResponse,
  ServiceOrderController,
  ServiceOrderControllerMethods,
} from '@skygate/protobuf/protobufs/order.pb';

@Controller()
@ServiceOrderControllerMethods()
export class PingServiceController implements ServiceOrderController {
  @RemoteFuncToService()
  pingService(): Promise<PingServiceResponse> {
    Logger.log('Received ping request from service merchant.');
    return Promise.resolve({
      serviceIsAlive: true,
      serviceName: 'ServiceOrder',
    });
  }
}
