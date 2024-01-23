import { transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';
import { trace } from '@opentelemetry/api';
import colors from 'colors';
import { isLocal } from '@skygate/shared';

/**
 * Adds trace ID format to the log message.
 * @param serviceName - The name of the service.
 * @returns A log format function that includes the trace ID in the log message.
 */
const addTraceIdFormat = (serviceName: string) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return colors.red(level);
      case 'warn':
        return colors.yellow(level);
      default:
        return colors.green(level); // Màu mặc định cho các level khác
    }
  };

  return format.printf(({ level, message, timestamp, ...meta }) => {
    const currentSpan = trace.getActiveSpan();
    const traceId = currentSpan?.spanContext().traceId || '---';

    const levelColor = getLevelColor(level);
    const metaString = metaStringFormat(meta);

    return `${colors.cyan(`[${serviceName}]`)} ${levelColor} ${colors.blue(
      traceId,
    )} ${colors.yellow(timestamp)} ${message} ${metaString}`;
  });
};

/**
 * Formats the meta object into a string representation.
 * If the meta object does not have 'context' and 'ms' properties, it returns the stringified meta object.
 * For the local environment, it returns the stringified meta object with indentation.
 * @param meta - The meta object to be formatted.
 * @returns The formatted meta object as a string.
 */
const metaStringFormat = (meta: Record<string | symbol, any>) => {
  let contextData;

  // Check if meta is an array and extract the first element as context
  if (Array.isArray(meta) && meta.length > 0) {
    contextData = meta[0];
  } else if (meta.context !== undefined) {
    contextData = meta.context;
  }

  // Validate contextData
  if (
    contextData &&
    ((typeof contextData === 'object' && contextData !== null) ||
      (Array.isArray(contextData) &&
        contextData.every((item) => typeof item === 'number')))
  ) {
    // Format and return the context data
    return isLocal()
      ? `\n${JSON.stringify(contextData, null, 2)}`
      : JSON.stringify(contextData);
  }

  // If contextData is not valid, return an empty string
  return '';
};

/**
 * Creates a Winston logger instance with the specified service name.
 * @param serviceName - The name of the service.
 * @returns The created Winston logger instance.
 */
export const WinstonLoggerFactory = (serviceName: string) => {
  const DEBUG = process.env.DEBUG;
  const USE_JSON_LOGGER = process.env.USE_JSON_LOGGER;

  const consoleFormat =
    USE_JSON_LOGGER === 'true'
      ? format.combine(format.ms(), format.timestamp(), format.json())
      : format.combine(
          format.ms(),
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.colorize({ all: true }),
          addTraceIdFormat(serviceName),
        );

  return WinstonModule.createLogger({
    level: DEBUG ? 'debug' : 'info',
    transports: [new transports.Console({ format: consoleFormat })],
  });
};
