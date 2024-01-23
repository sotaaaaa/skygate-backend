import { Global, Module } from '@nestjs/common';
import { AuthzService } from './authz.service';
import { MerchantCaslAbilityFactory } from './factories/merchant-ability.factory';

@Global()
@Module({
  providers: [AuthzService, MerchantCaslAbilityFactory],
  exports: [AuthzService, MerchantCaslAbilityFactory],
})
export class AuthzModule {}
