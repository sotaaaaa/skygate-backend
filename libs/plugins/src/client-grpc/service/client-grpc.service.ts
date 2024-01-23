import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class ClientGrpcExtraService implements OnModuleInit {
  private timeout = 30000;

  constructor(private readonly configService: ConfigService) {}

  // This method is called when the module is initialized
  onModuleInit() {
    // Get the timeout value from the configuration
    this.timeout = this.configService.get<number>('transporters.grpc.timeout');
    Logger.log(`Client GRPC initialized with timeout ${this.timeout}`);
  }

  // Get a service object by name and create a proxy for it
  public getService<T extends object>(clientGrpc: ClientGrpc, serviceName: string): T {
    /**
     * This method returns a service object by name.
     * The service object is a gRPC client that can be used to make calls to the service.
     */
    const service = clientGrpc.getService<T>(serviceName);
    return service;
  }
}
