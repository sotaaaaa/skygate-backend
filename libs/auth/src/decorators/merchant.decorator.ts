import { Request } from 'express';
import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { MerchantGuard } from '@skygate/auth/guards';
import { ServiceToClient } from '@skygate/core';
import {
  MerchantAuthzGuard,
  MerchantCheckPermissions,
  MerchantRequiredPermission,
} from '@skygate/auth/authz';

/**
 * Decorator for applying merchant authentication to a route or controller.
 * This decorator applies the `MerchantGuard` to the route or controller it is used on.
 * @returns {MethodDecorator & ClassDecorator} The decorator function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MerchantAuth = () => {
  return applyDecorators(UseGuards(MerchantGuard), ServiceToClient);
};

/**
 * Decorator that combines multiple decorators for merchant authorization and permission checks.
 * @param params The required permissions for the merchant.
 * @returns A decorator function that applies the necessary decorators for merchant authorization and permission checks.
 */
export const MerchantCheckAbilities = (...params: MerchantRequiredPermission[]) => {
  return applyDecorators(
    MerchantAuth(),
    MerchantCheckPermissions(...params),
    UseGuards(MerchantAuthzGuard),
    ServiceToClient(),
  );
};

/**
 * Decorator that retrieves the current seller from the request object.
 * @param data - Additional data (optional).
 * @param ctx - The execution context.
 * @returns The current user object.
 */
export const CurrentMerchant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
