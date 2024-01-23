import { Controller } from '@nestjs/common';
import { QueuesService } from './queues.service';

@Controller()
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}
}
