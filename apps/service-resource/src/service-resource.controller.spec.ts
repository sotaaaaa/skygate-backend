import { Test, TestingModule } from '@nestjs/testing';
import { ServiceResourceController } from './service-resource.controller';
import { ServiceResourceService } from './service-resource.service';

describe('ServiceResourceController', () => {
  let serviceResourceController: ServiceResourceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceResourceController],
      providers: [ServiceResourceService],
    }).compile();

    serviceResourceController = app.get<ServiceResourceController>(ServiceResourceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceResourceController.getHello()).toBe('Hello World!');
    });
  });
});
