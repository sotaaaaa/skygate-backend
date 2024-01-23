import {
  CHECK_PERMSSION_KEY,
  MerchantRequiredPermission,
} from '../decorators/merchant-permission.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MerchantCaslAbilityFactory } from '../factories/merchant-ability.factory';
import { MerchantInterface } from '@skygate/shared';

/**
 * Guard that checks if the user has the required permissions to access a route.
 */
@Injectable()
export class MerchantAuthzGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: MerchantCaslAbilityFactory,
  ) {}

  /**
   * Determines if the user has the required permissions to access the route.
   * @param context - The execution context.
   * @returns A promise that resolves to a boolean indicating if the user has the required permissions.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<MerchantRequiredPermission[]>(
        CHECK_PERMSSION_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest();
    const merchant = req.user as MerchantInterface;
    const ability = await this.abilityFactory.createForMerchant(merchant);

    return requiredPermissions.every((permission) => ability.can(...permission));
  }
}
