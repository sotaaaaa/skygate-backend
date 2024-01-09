import { Controller, Get } from '@nestjs/common';
import { ServiceResourceService } from './service-resource.service';

@Controller()
export class ServiceResourceController {
  constructor(private readonly serviceResourceService: ServiceResourceService) {}

  @Get()
  getHello(): string {
    return this.serviceResourceService.getHello();
  }
}
