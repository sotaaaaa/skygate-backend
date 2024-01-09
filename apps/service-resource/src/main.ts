import { NestFactory } from '@nestjs/core';
import { ServiceResourceModule } from './service-resource.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceResourceModule);
  await app.listen(3000);
}
bootstrap();
