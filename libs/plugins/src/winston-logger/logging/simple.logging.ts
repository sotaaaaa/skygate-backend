/* eslint-disable no-console */
import { ConsoleLogger, Inject, Injectable, LogLevel } from '@nestjs/common';
import { APM_INSTANCE } from '@skygate/plugins';
import { isLocal } from '@skygate/shared';
import APM from 'elastic-apm-node';
import * as _ from 'lodash';

@Injectable()
export class SimpleLoggerService extends ConsoleLogger {
  public readonly env = process.env.NODE_ENV || 'development';

  constructor(@Inject(APM_INSTANCE) private readonly elasicAPM: APM.Agent) {
    super(SimpleLoggerService.name);
  }

  /**
   * Lấy context và messages từ đối số truyền vào
   * @param args - Mảng các đối số truyền vào
   * @returns - Đối tượng chứa context và messages
   */
  private getContextAndMessages(args: unknown[]) {
    let context = process.env.SERVICE_NAME || this.context;
    let messages = args;

    // Nếu đối số cuối cùng là một chuỗi, nó là context
    if (args?.length > 1) {
      const lastElement = args[args.length - 1];
      if (_.isString(lastElement)) {
        context = lastElement as string;
        messages = args.slice(0, args.length - 1);
      }
    }

    // Nếu đối số đầu tiên là một chuỗi, nó là context
    return { context, messages };
  }

  /**
   * Lấy context, stack và messages từ đối số truyền vào
   * @param args - Mảng các đối số truyền vào
   * @returns - Đối tượng chứa context, stack và messages
   */
  private getContextAndStackAndMessages(args: unknown[]) {
    const { messages, context } = this.getContextAndMessages(args);
    if (!messages || messages.length <= 1) {
      return { messages, context };
    }

    // Nếu đối số cuối cùng là một chuỗi, nó là stack
    const lastElement = messages[messages.length - 1];
    const isStack = _.isString(lastElement);

    if (isStack) {
      return {
        stack: lastElement as string,
        messages: messages.slice(0, messages.length - 1),
        context,
      };
    } else {
      // Thêm else statement để tránh redundant return statement
      return { messages, context };
    }
  }

  /**
   * Hiển thị message và stack
   * @param context - Context
   * @param messages - Mảng các message
   * @param level - Mức độ log
   * @param messageRef - Tham chiếu đến message
   * @param writeStreamType - Loại write stream
   */
  private printMessage(
    context: string,
    messages: any[],
    level: LogLevel = 'log',
    messageRef: string,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    const messageLocal = messages.map((data) => this.stringifyMessage(data, level));
    const traceId = this.elasicAPM.currentTraceIds['trace.id'] || '---';
    const levelString = level.toUpperCase().padStart(7, ' ');
    const formattedMsgs = isLocal()
      ? messageLocal
      : messages.map((data) => {
          if (['number', 'boolean', 'string'].includes(typeof data)) {
            return data;
          }
          return JSON.stringify(data);
        });

    // Format context
    const formattedContext = isLocal() ? this.formatContext(context) : `[${context}]`;
    const formattedLogLevel = isLocal() ? this.colorize(levelString, level) : levelString;
    const formattedTraceId = isLocal() ? this.colorize(traceId, level) : traceId;
    const formattedDate = this.colorize(new Date().toLocaleString('fr'), level);
    const composedMessage = `${formattedDate} ${formattedLogLevel} ${formattedTraceId} ${formattedContext}`;

    // Tìm kiếm transaction và tạo các cặp thẻ span
    const transaction = this.elasicAPM.currentTransaction;

    // Nếu có transaction, tạo span mới và kết thúc span hiện tại
    // Kết thúc span hiện tại để giúp đo thời gian thực thi
    if (transaction) {
      /**
       * Nếu level log là error thì sẽ capture error
       * Còn không thì sẽ start span và end span
       */
      if (level == 'error') {
        // Capture error to APM
        this.elasicAPM.captureError(messageRef.toString());

        // Start span and end span
      } else {
        const span = transaction.startSpan(messageRef, levelString);
        span.end();
      }
    }

    // Ghi log
    writeStreamType == 'stderr'
      ? console.error(composedMessage, ...formattedMsgs)
      : console.log(composedMessage, ...formattedMsgs);
  }

  /**
   * Ghi log ở mức 'log'.
   */
  log(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'log', message);
  }

  /**
   * Ghi log ở mức 'error'.
   */
  error(message: any, ...optionalParams: any[]): any {
    const { messages, context, stack } = this.getContextAndStackAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'error', message, 'stderr');
    this.printStackTrace(stack);
  }

  /**
   * Ghi log ở mức 'warn'.
   */
  warn(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'warn', message);
  }

  /**
   * Ghi log ở mức 'debug'.
   */
  debug(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'debug', message);
  }

  /**
   * Ghi log ở mức 'verbose'.
   */
  verbose(message: any, ...optionalParams: any[]): any {
    const { messages, context } = this.getContextAndMessages([
      message,
      ...optionalParams,
    ]);

    this.printMessage(context, messages, 'verbose', message);
  }
}
