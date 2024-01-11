import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ErrorCodes } from '@skygate/core/constants';
import { APM_INSTANCE } from '@skygate/plugins';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Response } from 'express';
import * as APM from 'elastic-apm-node';

/**
 * Interceptor for handling HTTP requests and responses.
 * This interceptor starts a new APM transaction and span for each HTTP request,
 * and logs the transaction result and duration.
 * It also converts the response data to a standard format.
 *
 * @typeparam T - The type of the response data.
 */
@Injectable()
export class HttpInterceptor<T> implements NestInterceptor<T> {
  constructor(@Inject(APM_INSTANCE) private readonly elasticAPM: APM.Agent) {}

  /**
   * End transaction and span when request is completed.
   * Set trace id and traceparent to headers.
   * @param response
   * @param transaction
   */
  private setTraceToHeadersAndEndTransaction(
    response: Response,
    transaction: APM.Transaction,
    status = HttpStatus.OK,
  ) {
    // Change transaction result to 200
    // Set HTTP status code to OK
    transaction.result = status;
    response && response.status && response.status(HttpStatus.OK);

    // End transaction and span
    const span = this.elasticAPM.currentSpan;
    transaction && transaction.end();
    span && span.end();

    // Get trace id and traceparent from the transaction
    // If context is available, then set trace id and traceparent to headers
    const traceId = transaction.ids['trace.id'];
    const traceparent = transaction.traceparent;

    // Set trace id and traceparent to headers
    response.setHeader('x-trace-id', traceId);
    response.setHeader('x-traceparent-id', traceparent);
    response.setHeader('x-transaction-status', transaction.result);
  }

  /**
   * Intercepts the HTTP request and response.
   *
   * @param context - The execution context.
   * @param next - The call handler.
   * @returns An observable of the processed response.
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    // Check if the request is an HTTP request then continue the interceptor˝
    const isHttpRequest = context.getType() === 'http';
    if (!isHttpRequest) return next.handle();

    // Start new APM transaction and span.
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const originalUrl = request['originalUrl'];
    const endpoint = `${request.method.toUpperCase()} ${originalUrl.split('?')[0]}`;
    const transaction = this.elasticAPM.startTransaction(endpoint, 'HTTP');
    const preTimeNow = Date.now();

    // Process the request and continue the transaction
    return next.handle().pipe(
      map((data) => {
        // Log info result and duration of the transaction
        // Set trace id and traceparent to headers
        Logger.log(`${endpoint} ${transaction.result} [${Date.now() - preTimeNow}ms]`);
        this.setTraceToHeadersAndEndTransaction(response, transaction);

        return {
          code: ErrorCodes.HttpSuccess,
          data: data,
        };
      }),
      catchError((error) => {
        // Log info result and duration of the transaction
        Logger.error(error);

        // Set trace id and traceparent to headers
        this.setTraceToHeadersAndEndTransaction(
          response,
          transaction,
          HttpStatus.BAD_REQUEST,
        );

        // Throw error to the next handler
        return throwError(() => error);
      }),
    );
  }
}
