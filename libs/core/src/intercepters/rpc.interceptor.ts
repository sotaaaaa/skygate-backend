import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { APM_INSTANCE } from '@skygate/plugins';
import { Observable, catchError, map, throwError } from 'rxjs';
import * as APM from 'elastic-apm-node';

/**
 * Interceptor for RPC requests.
 * This interceptor creates a new transaction and span for RPC requests,
 * and handles the request status and span ending.
 */
@Injectable()
export class RpcInterceptor<T> implements NestInterceptor<T> {
  constructor(@Inject(APM_INSTANCE) private readonly elasticAPM: APM.Agent) {}

  /**
   * End transaction and span when request is completed.
   * @param transaction
   * @param span
   */
  private endTransactionAPM(transaction: APM.Transaction, status = HttpStatus.OK) {
    // Change transaction result to 200
    transaction.result = status;
    transaction.end();

    // Get span from the transaction and end it
    const span = this.elasticAPM.currentSpan;
    span && span.end();
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

    // Create a new transaction and span
    let transaction: APM.Transaction;

    // Get the metadata from the context
    const metadata = context.getArgByIndex(1);
    const traceId = metadata.internalRepr.get('trace-id')[0];
    const traceparent = metadata.internalRepr.get('current-traceparent')[0];
    const endpoint = `RPC/${context.getHandler().name}`;

    // If trace id is not provided, then new transaction
    if (traceId === 'none' || !traceId) {
      transaction = this.elasticAPM.startTransaction(endpoint, 'RPC');
      transaction.startSpan(context.getHandler().name, 'RPC Interceptor');

      // Change metadata to trace id and traceparent from transaction
      metadata.internalRepr.set('trace-id', [transaction.ids['trace.id']]);
      metadata.internalRepr.set('traceparent', [transaction.traceparent]);
    }

    // If trace id is provided, then continue transaction
    // Start span and continue transaction
    transaction = this.elasticAPM.startTransaction(endpoint, 'RPC', {
      childOf: traceparent,
    });

    // Change request status to 200 and end span when request is completed
    // If error, then change request status to 500
    return next.handle().pipe(
      map((value) => {
        // Check if transaction is created, then change transaction result to 200
        this.endTransactionAPM(transaction);

        // Return result
        return value;
      }),
      catchError((error) => {
        // Log info result and duration of the transaction
        Logger.error(error);

        // Check if transaction is created, then change transaction result to 200
        this.endTransactionAPM(transaction, HttpStatus.BAD_REQUEST);

        // Return error handler
        return throwError(() => error);
      }),
    );
  }
}
