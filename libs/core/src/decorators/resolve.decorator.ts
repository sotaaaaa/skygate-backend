import { RabbitHandlerConfig, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UseFilters, UseInterceptors, applyDecorators } from '@nestjs/common';
import { RabbitExceptionFilter, HttpInterceptor, RpcInterceptor } from '@skygate/core';

/**
 * Decorator that applies the `UseFilters` decorator with the `ErrorExceptionFilter` to a service method.
 * @returns The decorated method.
 */
export const ServiceToClient = () => {
  return applyDecorators(UseInterceptors(HttpInterceptor, RpcInterceptor));
};

/**
 * Decorator that applies the `UseFilters` decorator with the `ErrorExceptionFilter` to a service method.
 * @returns The decorated method.
 */
export const ServiceToService = () => {
  return applyDecorators(UseInterceptors(RpcInterceptor));
};

/**
 * Decorator that applies the `UseFilters` decorator with the `ErrorExceptionFilter` to a service method.
 * @returns The decorated method.
 */
export const RabbitMQSubscribe = (
  config: Pick<
    RabbitHandlerConfig,
    | 'exchange'
    | 'routingKey'
    | 'queue'
    | 'queueOptions'
    | 'name'
    | 'connection'
    | 'createQueueIfNotExists'
    | 'assertQueueErrorHandler'
    | 'errorBehavior'
    | 'errorHandler'
    | 'allowNonJsonMessages'
  >,
) => {
  return applyDecorators(UseFilters(RabbitExceptionFilter), RabbitSubscribe(config));
};
