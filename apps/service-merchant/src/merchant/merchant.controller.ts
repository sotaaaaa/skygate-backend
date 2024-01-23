import { Controller, Get, Logger } from '@nestjs/common';
import { MerchantActions, MerchantSubjects, MerchantCheckAbilities } from '@skygate/auth';
import { ClientGrpcService } from '@skygate/plugins';
import {
  AUTH_MERCHANT_SERVICE_NAME,
  AuthMerchantClient,
} from '@skygate/protobuf/protobufs/auth-merchant.pb';

@Controller()
export class MerchantController {
  @ClientGrpcService('ServiceAuth', AUTH_MERCHANT_SERVICE_NAME)
  private readonly authMerchant: AuthMerchantClient;

  @Get('/ping')
  @MerchantCheckAbilities([MerchantActions.MANAGE, MerchantSubjects.ALL])
  async pingService() {
    Logger.log('Received ping request from client.');
    return { serviceIsAlive: true };
  }
}
