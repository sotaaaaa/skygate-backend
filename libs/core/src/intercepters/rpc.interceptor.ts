import { TraceService } from '@metinseylan/nestjs-opentelemetry';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Span, SpanStatusCode } from '@opentelemetry/api';
import { Observable, catchError, map, throwError } from 'rxjs';

/**
 * Interceptor for RPC requests.
 * This interceptor creates a new transaction and span for RPC requests,
 * and handles the request status and span ending.
 */
@Injectable()
export class RpcInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly traceService: TraceService) {}

  /**
   * End transaction and span when request is completed.
   * @param transaction
   * @param span
   */
  private endCurrentSpanAndSetStatus(currentSpan: Span, status = HttpStatus.OK) {
    // Change transaction result to 200
    // Set HTTP status code to OK
    const spanCode = status == HttpStatus.OK ? SpanStatusCode.OK : SpanStatusCode.ERROR;
    currentSpan.setStatus({ code: spanCode });

    // Get span from the transaction and end it
    currentSpan && currentSpan.end();
  }

  /**
   * Intercepts the RPC request and performs necessary actions.
   * @param context - The execution context of the request.
   * @param next - The next call handler.
   * @returns An observable of the request result.
   */
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    // Check if the request is an RPC request then continue the interceptor
    const isRpcRequest = context.getType() === 'rpc';
    if (!isRpcRequest) return next.handle();

    // Get the metadata from the context
    const endpoint = `RPC/${context.getHandler().name}`;
    const currentSpan = this.traceService.startSpan(endpoint);

    // Change request status to 200 and end span when request is completed
    // If error, then change request status to 500
    return next.handle().pipe(
      map((value) => {
        // Check if transaction is created, then change transaction result to 200
        this.endCurrentSpanAndSetStatus(currentSpan);
        return value;
      }),
      catchError((error) => {
        // Log info result and duration of the transaction
        Logger.error(error);

        // Check if transaction is created, then change transaction result to 200
        this.endCurrentSpanAndSetStatus(currentSpan, HttpStatus.BAD_REQUEST);
        return throwError(() => error);
      }),
    );
  }
}
