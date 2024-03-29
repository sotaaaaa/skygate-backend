import { ConfigModule } from '@nestjs/config';
import { CorePluginModule } from './module/plugin.bootstrap';
import { ModuleBootstrapOptions } from './module/types/module.type';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientGrpcModule } from '@skygate/plugins';
import { DatabaseModule, DatabaseTypes } from '@skygate/core/databases';
import { RabbitMQExtraModule } from '@skygate/core/transporters';
import { AuthzModule } from '@skygate/auth';
import { OpenTelemetryModule } from '@metinseylan/nestjs-opentelemetry';

/**
 * Represents the bootstrap class for the CoreModule.
 * This class provides a static method to register the CoreModule with specified options.
 */
@Global()
@Module({})
export class CoreModuleBootstrap {
  /**
   * Registers the CoreModule with the specified options.
   * @param options - The options for module bootstrap.
   * @returns A dynamic module object representing the registered CoreModule.
   */
  static register(options: ModuleBootstrapOptions): DynamicModule {
    return {
      module: CoreModuleBootstrap,
      imports: [
        ConfigModule.forRoot({ envFilePath: options.envFilePath, isGlobal: true }),
        CorePluginModule.register({
          path: options.path,
          envFilePath: options.envFilePath,
        }),
        OpenTelemetryModule.forRoot({ serviceName: options.serviceName }),
        ClientGrpcModule.forPlugin(options.path),
        DatabaseModule.forRoot(options.path, { allows: [DatabaseTypes.MONGOOSE] }),
        RabbitMQExtraModule.forRoot(options.path),

        // Import module support casl authorization
        AuthzModule,
      ],
      global: true,
    };
  }
}
