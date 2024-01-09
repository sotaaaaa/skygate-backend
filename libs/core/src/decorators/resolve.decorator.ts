import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { HttpInterceptor, RpcInterceptor } from '@skygate/core';

/**
 * Decorator that applies the `UseFilters` decorator with the `ErrorExceptionFilter` to a service method.
 * @returns The decorated method.
 */
export const ServiceToClient = () => {
  return applyDecorators(UseInterceptors(HttpInterceptor, RpcInterceptor));
};
