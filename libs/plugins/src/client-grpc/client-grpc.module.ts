import { ClientGrpcExtraService } from './service/client-grpc.service';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { AppUtils } from '@skygate/shared';
import {
  ClientsModule,
  ClientsProviderAsyncOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import _ from 'lodash';
import fg from 'fast-glob';

@Global()
@Module({})
export class ClientGrpcModule {
  /**
   * Creates a dynamic module for the ClientGrpcModule.
   * This module is used for plugin configuration.
   * It registers a gRPC client with the specified options.
   * It also provides the ElasticApmService instance for the gRPC client.
   */
  static forPlugin(configPath: string): DynamicModule {
    // Load the configuration file
    const configs = AppUtils.loadYamlFile(configPath);

    // Get the gRPC clients from the configuration
    const grpcClients: [GrpcOptions & { name: string }] =
      _.get(configs, 'transporters.grpc-clients') || [];

    // Generate all grpc clients from the configuration
    const clients: ClientsProviderAsyncOptions[] = grpcClients.map((client) => ({
      name: client.name,
      useFactory: () => {
        return {
          transport: Transport.GRPC,
          options: {
            ...client.options,
            protoPath: fg.sync(client.options.protoPath),
          },
        };
      },
    }));

    // Import the configuration module.
    const imports: DynamicModule[] = [
      ClientsModule.registerAsync({ isGlobal: true, clients: clients }),
    ];

    // Return module configuration
    return {
      module: ClientGrpcModule,
      providers: [ClientGrpcExtraService],
      exports: [ClientGrpcExtraService],
      imports: imports,
    };
  }
}
