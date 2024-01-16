import { Catch, HttpStatus, ExceptionFilter, Inject } from '@nestjs/common';
import { ErrorResponse } from './error.exception';
import { ErrorMappings } from './error.mapping';
import { AppConstants } from '@skygate/core/constants';
import { APM_INSTANCE } from '@skygate/plugins';
import { throwError } from 'rxjs';
import * as APM from 'elastic-apm-node';

// Sử dụng decorator Catch để đánh dấu lớp này là global exception filter.
@Catch()
export class RabbitExceptionFilter implements ExceptionFilter {
  // Inject instance của APM vào filter.
  constructor(@Inject(APM_INSTANCE) private readonly elasticAPM: APM.Agent) {}

  // Phương thức này được gọi khi có exception được throw trong ứng dụng.
  catch(exception) {
    // Lấy response từ exception. Thông thường đây là một object với property message.
    // Lấy error code từ exception response hoặc map status code thành error code.
    const exceptionResponse = (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, code, errors, message } = exceptionResponse as ErrorResponse & {
      statusCode: HttpStatus;
    };
    const errorCode = code || ErrorMappings.nestJsErrorMapping(statusCode);
    const timestamp = new Date().toISOString();

    // Log exception vào console.
    // Capture lỗi trong APM để theo dõi.
    this.elasticAPM.captureError(exception);

    // Tạo object error response.
    const errorResponse = {
      code: errorCode,
      timestamp: timestamp,
      errors: errors,
      message: message || AppConstants.errors.defaultMessage,
    };

    throwError(() => errorResponse);
  }
}
