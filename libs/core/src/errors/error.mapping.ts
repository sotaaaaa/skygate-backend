import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './../constants/error.constant';
import { status } from '@grpc/grpc-js';

// ErrorMappings class is used to map HTTP and MongoDB error codes to your system's error codes.
export class ErrorMappings {
  // A mapping object where keys are HTTP and MongoDB error codes and values are your system's error codes.
  private static errorMapping: Record<number | string, ErrorCodes> = {
    [HttpStatus.REQUEST_TIMEOUT]: ErrorCodes.HttpRequestTimeout,
    [HttpStatus.BAD_REQUEST]: ErrorCodes.HttpBadRequest,
    [HttpStatus.UNAUTHORIZED]: ErrorCodes.HttpUnauthorized,
    [HttpStatus.FORBIDDEN]: ErrorCodes.HttpForbidden,
    [HttpStatus.NOT_FOUND]: ErrorCodes.HttpNotFound,
    [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCodes.HttpUnprocessableEntity,
    [HttpStatus.TOO_MANY_REQUESTS]: ErrorCodes.HttpTooManyRequests,
    [HttpStatus.BAD_GATEWAY]: ErrorCodes.HttpBadGateway,
    [HttpStatus.GATEWAY_TIMEOUT]: ErrorCodes.HttpGatewayTimeout,
    [HttpStatus.SERVICE_UNAVAILABLE]: ErrorCodes.HttpServiceUnavailable,
    11000: ErrorCodes.MongoDBDuplicateKeyError,
  };

  // Method to map a given HTTP or MongoDB error code to your system's error code.
  public static nestJsErrorMapping(statusCode: number | string): ErrorCodes {
    // If the given error code exists in the mapping object, return the corresponding system's error code.
    // Otherwise, return the system's HttpServerError error code.
    return this.errorMapping[statusCode] || ErrorCodes.HttpServerError;
  }

  /**
   * Map HTTP status code thành gRPC status code.
   * @param httpStatusCode
   * @returns
   */
  public static grpcErrorMapping(httpStatusCode: HttpStatus): number {
    const HttpStatusCode: Record<number, number> = {
      [HttpStatus.BAD_REQUEST]: status.INVALID_ARGUMENT,
      [HttpStatus.UNAUTHORIZED]: status.UNAUTHENTICATED,
      [HttpStatus.FORBIDDEN]: status.PERMISSION_DENIED,
      [HttpStatus.NOT_FOUND]: status.NOT_FOUND,
      [HttpStatus.CONFLICT]: status.ALREADY_EXISTS,
      [HttpStatus.GONE]: status.ABORTED,
      [HttpStatus.TOO_MANY_REQUESTS]: status.RESOURCE_EXHAUSTED,
      [HttpStatus.INTERNAL_SERVER_ERROR]: status.INTERNAL,
      [HttpStatus.NOT_IMPLEMENTED]: status.UNIMPLEMENTED,
      [HttpStatus.BAD_GATEWAY]: status.UNKNOWN,
      [HttpStatus.SERVICE_UNAVAILABLE]: status.UNAVAILABLE,
      [HttpStatus.GATEWAY_TIMEOUT]: status.DEADLINE_EXCEEDED,
      [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: status.UNAVAILABLE,
      [HttpStatus.PAYLOAD_TOO_LARGE]: status.OUT_OF_RANGE,
      [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: status.CANCELLED,
      [HttpStatus.UNPROCESSABLE_ENTITY]: status.CANCELLED,
      [HttpStatus.I_AM_A_TEAPOT]: status.UNKNOWN,
      [HttpStatus.METHOD_NOT_ALLOWED]: status.CANCELLED,
      [HttpStatus.PRECONDITION_FAILED]: status.FAILED_PRECONDITION,
      499: status.CANCELLED,
      11000: status.ALREADY_EXISTS,
    };

    // Nếu không tìm thấy HTTP status code trong mapping, trả về UNKNOWN.
    return HttpStatusCode[httpStatusCode] ?? status.UNKNOWN;
  }
}
