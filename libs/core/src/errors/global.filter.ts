import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './error.exception';
import { ErrorMappings } from './error.mapping';
import { AppConstants, ErrorCodes } from '@skygate/core/constants';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import _ from 'lodash';

// Sử dụng decorator Catch để đánh dấu lớp này là global exception filter.
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Parse thông tin chi tiết từ exception thành error response.
   * Details có thể là string hoặc object stringified.
   * @param exception
   */
  private parseRpcExceptionDetails(exception: RpcException) {
    try {
      // Lấy thông tin chi tiết từ exception dưới dạng string.
      // Parse thông tin chi tiết từ exception thành JSON.
      const exceptionResponseString = exception['details'];
      return _.get(exception, 'response.errorCode')
        ? exception['response']
        : JSON.parse(exceptionResponseString);

      // Nếu có lỗi khi parse thông tin chi tiết từ exception, trả về default error response.
    } catch (error) {
      // Trả về default error response.
      return {
        errorCode: ErrorCodes.RpcRequestError,
        timestamp: new Date().toISOString(),
        message: exception.message || 'gRPC request error',
      };
    }
  }

  // Phương thức này được gọi khi có exception được throw trong ứng dụng.
  catch(exception, host: ArgumentsHost) {
    // Lấy request và response object từ host.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Lấy response từ exception. Thông thường đây là một object với property message.
    // Lấy error code từ exception response hoặc map status code thành error code.
    const exceptionResponse = (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, errorCode, errors, message } =
      exceptionResponse as ErrorResponse & {
        statusCode: HttpStatus;
      };
    const errorCodeMapping =
      errorCode || ErrorMappings.nestJsErrorMapping(statusCode || exception['code']);
    const timestamp = new Date().toISOString();
    const isHttpRequest = host.getType() === 'http';

    // Log exception vào console.
    Logger.error(exception, this.constructor.name);

    // Nếu exception là RPC exception, parse thông tin chi tiết từ exception.
    if (isHttpRequest && !statusCode) {
      // Lấy thông tin chi tiết từ exception và kiểm tra xem nó có phải là JSON string hay không.
      const errorResponse = this.parseRpcExceptionDetails(exception);

      // Nếu không có response object (tức là chúng ta đang trong context của microservice), trả về error response.
      return response.status(HttpStatus.OK).json(errorResponse);
    }

    // Tạo object error response.
    const errorResponse = {
      errorCode: errorCodeMapping,
      timestamp: timestamp,
      errors: errors,
      message: message || AppConstants.errors.defaultMessage,
    };
    const errorWithoutUndefined = _.omitBy(errorResponse, _.isUndefined);

    // Nếu không có response object (tức là chúng ta đang trong context của microservice), trả về error response.
    if (!isHttpRequest) {
      // Omit các property có giá trị undefined với lodash.
      const rpcErrorResponse = JSON.stringify(errorWithoutUndefined);

      // Throw error với code và message.
      return throwError(() => ({
        code: ErrorMappings.grpcErrorMapping(statusCode),
        message: errorResponse.message,
        details: rpcErrorResponse,
      }));
    }

    // Nếu có response object (tức là chúng ta đang trong context của HTTP), gửi error response.
    response.status(HttpStatus.OK).json(errorWithoutUndefined);
  }
}
