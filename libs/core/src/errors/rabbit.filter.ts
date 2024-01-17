import { Catch, HttpStatus, ExceptionFilter, Inject, Logger } from '@nestjs/common';
import { ErrorResponse } from './error.exception';
import { ErrorMappings } from './error.mapping';
import { AppConstants } from '@skygate/core/constants';
import { APM_INSTANCE } from '@skygate/plugins';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import * as APM from 'elastic-apm-node';

// Sử dụng decorator Catch để đánh dấu lớp này là global exception filter.
@Catch(RpcException)
export class RabbitExceptionFilter implements ExceptionFilter {
  // Inject instance của APM vào filter.
  constructor(@Inject(APM_INSTANCE) private readonly elasticAPM: APM.Agent) {}

  // Phương thức này được gọi khi có exception được throw trong ứng dụng.
  catch(exception) {
    // Lấy response từ exception. Thông thường đây là một object với property message.
    // Lấy error code từ exception response hoặc map status code thành error code.
    const exceptionResponse = (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, errorCode, errors, message } =
      exceptionResponse as ErrorResponse & {
        statusCode: HttpStatus;
      };
    const newErrorCode = errorCode || ErrorMappings.nestJsErrorMapping(statusCode);
    const timestamp = new Date().toISOString();

    // Log exception vào console.
    // Capture lỗi trong APM để theo dõi.
    this.elasticAPM.captureError(exception);
    Logger.error(exception, this.constructor.name);

    // Tạo object error response.
    const errorResponse = {
      errorCode: newErrorCode,
      timestamp: timestamp,
      errors: errors,
      message: message || AppConstants.errors.defaultMessage,
    };

    throwError(() => errorResponse);
  }
}
