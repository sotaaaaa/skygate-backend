import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceResourceService {
  getHello(): string {
    return 'Hello World!';
  }
}
