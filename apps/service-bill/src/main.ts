import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ServiceModule } from './service.module';
import { serviceBootstrap } from '@skygate/core';

async function bootstrap() {
  const app = await NestFactory.create(ServiceModule, {
    cors: { origin: '*' },
    bufferLogs: true,
  });

  // Get config service
  const configService = app.get(ConfigService);

  // Start application
  // Note: This function will start all microservices
  await serviceBootstrap(app, {
    serviceName: process.env.SERVICE_NAME,
    configPath: process.env.configfile || 'apps/service-bill/service.config.yaml',
    servicePort: configService.get<number>('application.port'),
  });
}
bootstrap();
