import { Controller, Get, Logger } from '@nestjs/common';
import { ServiceToClient } from '@skygate/core';
import { ClientGrpcService } from '@skygate/plugins';
import {
  SERVICE_ORDER_SERVICE_NAME,
  ServiceOrderClient,
} from '@skygate/protobuf/protobufs/order.pb';

@Controller()
export class MerchantController {
  @ClientGrpcService('ServiceOrder', SERVICE_ORDER_SERVICE_NAME)
  private readonly serviceOrderClient: ServiceOrderClient;

  @ServiceToClient()
  @Get('/merchant/ping')
  async pingService() {
    Logger.log('Received ping request from client.');
    return Promise.resolve('pong');
  }
}
