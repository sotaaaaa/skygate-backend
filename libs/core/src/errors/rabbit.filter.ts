import { Catch, HttpStatus, ExceptionFilter, Logger } from '@nestjs/common';
import { ErrorResponse } from './error.exception';
import { ErrorMappings } from './error.mapping';
import { AppConstants } from '@skygate/core/constants';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

// Sử dụng decorator Catch để đánh dấu lớp này là global exception filter.
@Catch(RpcException)
export class RabbitExceptionFilter implements ExceptionFilter {
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
