import { TraceService } from '@metinseylan/nestjs-opentelemetry';
import { Span, SpanStatusCode } from '@opentelemetry/api';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ErrorCodes } from '@skygate/core/constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Response } from 'express';

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
  constructor(private readonly traceService: TraceService) {}

  /**
   * End transaction and span when request is completed.
   * Set trace id and traceparent to headers.
   * @param response
   * @param transaction
   */
  private setTraceToHeadersAndEndTransaction(
    response: Response,
    currentSpan: Span,
    status = HttpStatus.OK,
  ) {
    // Change transaction result to 200
    // Set HTTP status code to OK
    const spanCode = status == HttpStatus.OK ? SpanStatusCode.OK : SpanStatusCode.ERROR;
    currentSpan.setStatus({ code: spanCode });
    response && response.status && response.status(HttpStatus.OK);

    // End transaction and span
    currentSpan && currentSpan.end();

    // Get trace id and traceparent from the transaction
    // If context is available, then set trace id and traceparent to headers
    const traceId = currentSpan.spanContext().traceId;

    // Set trace id and traceparent to headers
    response.setHeader('x-trace-id', traceId);
    response.setHeader('x-trace-status', spanCode);
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
    const preTimeNow = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const originalUrl = request['originalUrl'];
    const endpoint = `${request.method.toUpperCase()} ${originalUrl.split('?')[0]}`;
    const currentSpan = this.traceService.startSpan(endpoint);

    // Process the request and continue the transaction
    return next.handle().pipe(
      map((data) => {
        // Log info result and duration of the transaction
        // Set trace id and traceparent to headers
        Logger.log(`${endpoint} [${Date.now() - preTimeNow}ms]`);
        this.setTraceToHeadersAndEndTransaction(response, currentSpan);

        return {
          errorCode: ErrorCodes.HttpSuccess,
          data: data,
        };
      }),
      catchError((error) => {
        // Log info result and duration of the transaction
        Logger.error(error);

        // Set trace id and traceparent to headers
        this.setTraceToHeadersAndEndTransaction(
          response,
          currentSpan,
          HttpStatus.BAD_REQUEST,
        );

        // Throw error to the next handler
        return throwError(() => error);
      }),
    );
  }
}
