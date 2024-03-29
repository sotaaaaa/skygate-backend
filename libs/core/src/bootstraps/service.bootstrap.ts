import { ValidationPipe } from './../pipes/validation.pipe';
import { CoreTransporter } from './../transporters/core.transporter';
import { AppUtils } from '@skygate/shared';
import { ServiceBootstrapOptions } from './types/bootstrap.type';
import { INestApplication, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from '@skygate/core/errors';
import { WinstonLoggerFactory } from '@skygate/plugins';

/**
 * Bootstraps the service by killing the application with grace.
 * @param application - The INestApplication instance.
 * @param options - Optional service bootstrap options.
 */
export async function serviceBootstrap(
  application: INestApplication,
  options?: ServiceBootstrapOptions,
) {
  // Kill the application with grace.
  AppUtils.killAppWithGrace(application);

  // Enable shutdown hooks.
  application.enableShutdownHooks();

  // Set the global prefix.
  application.useLogger(WinstonLoggerFactory(options.serviceName));
  application.useGlobalPipes(new ValidationPipe());
  application.useGlobalFilters(new GlobalExceptionFilter());

  // Start all transporters.
  CoreTransporter.startAllTransporters(application, options);

  // Start the application and listen on the specified port.
  await application.startAllMicroservices();
  await application.listen(options.servicePort);

  // Log the service information.
  const serviceName = options.serviceName;
  const serviceUrl = await application.getUrl();

  // Calculate the boot time.
  const bootTime = process.uptime();
  const bootTimeStr = bootTime.toFixed(2);

  // Log the service information.
  Logger.log(`Service ${serviceName} running on: ${serviceUrl}`);
  Logger.log(`Service ${serviceName} started in ${bootTimeStr}s`);
}
