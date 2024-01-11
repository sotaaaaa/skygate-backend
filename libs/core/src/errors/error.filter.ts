import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './error.exception';
import { ErrorMappings } from './error.mapping';
import { AppConstants, ErrorCodes } from '@skygate/core/constants';
import { APM_INSTANCE } from '@skygate/plugins';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import * as APM from 'elastic-apm-node';
import * as _ from 'lodash';

// Sử dụng decorator Catch để đánh dấu lớp này là global exception filter.
@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  // Inject instance của APM vào filter.
  constructor(@Inject(APM_INSTANCE) private readonly elasticAPM: APM.Agent) {}

  /**
   * Parse thông tin chi tiết từ exception thành error response.
   * Details có thể là string hoặc object stringified.
   * @param exception
   */
  private parseExceptionDetails(exception: RpcException) {
    try {
      // Lấy thông tin chi tiết từ exception dưới dạng string.
      // Parse thông tin chi tiết từ exception thành JSON.
      const exceptionResponseString = exception['details'];
      return JSON.parse(exceptionResponseString);

      // Nếu có lỗi khi parse thông tin chi tiết từ exception, trả về default error response.
    } catch (error) {
      // Capture lỗi trong APM để theo dõi.
      this.elasticAPM.captureError(exception);

      // Trả về default error response.
      return {
        code: ErrorCodes.RpcRequestError,
        timestamp: new Date().toISOString(),
        message: exception.message || 'gRPC request error',
      };
    }
  }

  /**
   * Set trace id and traceparent from APM transaction to header.
   * x-trace-id, x-traceparent-id
   * @param exception
   */
  private captureTraceToHeader(response: Response) {
    // Lấy transaction hiện tại từ APM.
    const transaction = this.elasticAPM.currentTransaction;
    if (!transaction) {
      Logger.warn('No transaction found in APM');
      return;
    }

    // Lấy trace id và traceparent từ transaction.
    const traceId = transaction.ids['trace.id'];
    const traceparent = transaction.traceparent;

    // Get response từ exception.
    response.setHeader('x-trace-id', traceId);
    response.setHeader('x-traceparent-id', traceparent);
    transaction.end(); // End transaction.
  }

  // Phương thức này được gọi khi có exception được throw trong ứng dụng.
  catch(exception, host: ArgumentsHost) {
    // Lấy request và response object từ host.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Lấy response từ exception. Thông thường đây là một object với property message.
    // Lấy error code từ exception response hoặc map status code thành error code.
    const exceptionResponse = (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, code, errors, message } = exceptionResponse as ErrorResponse & {
      statusCode: HttpStatus;
    };
    const errorCode = code || ErrorMappings.nestJsErrorMapping(statusCode);
    const timestamp = new Date().toISOString();
    const isHttpRequest = host.getType() === 'http';

    // Log exception vào console.
    // Capture lỗi trong APM để theo dõi.
    Logger.error(exception);
    this.elasticAPM.captureError(exception);

    // Nếu exception là RPC exception, parse thông tin chi tiết từ exception.
    if (isHttpRequest && !statusCode) {
      // Lấy thông tin chi tiết từ exception và kiểm tra xem nó có phải là JSON string hay không.
      // Set trace id và traceparent từ APM transaction vào header.
      const errorResponse = this.parseExceptionDetails(exception);
      this.captureTraceToHeader(response);

      // Nếu không có response object (tức là chúng ta đang trong context của microservice), trả về error response.
      return response.status(HttpStatus.OK).json(errorResponse);
    }

    // Tạo object error response.
    const errorResponse = {
      code: errorCode,
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
    this.captureTraceToHeader(response); // Set trace id và traceparent từ APM transaction vào header.
    response.status(HttpStatus.OK).json(errorWithoutUndefined);
  }
}
