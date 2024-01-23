import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppUtils } from '@skygate/shared';

@Global()
@Module({})
export class MongooseConnectModule {
  /**
   * Get the Mongoose configurations from the provided configuration file.
   * @param path The path to the configuration file.
   * @returns An array of Mongoose configurations.
   */
  static getConfigs(path: string) {
    // Parse the YAML configuration
    const rootConfigs = AppUtils.loadYamlFile(path) || {};

    // Check if root configurations exist
    if (!rootConfigs) {
      Logger.log("Can't find root configs");
      return;
    }

    // Extract the Mongoose configurations
    const { database } = rootConfigs || {};
    const { mongoose } = database || {};

    return mongoose || [];
  }

  /**
   * Connect to multiple MongoDB databases based on the provided configuration file.
   * @param path The path to the configuration file.
   * @returns A dynamic module with the imported Mongoose modules.
   */
  static connect(path: string): DynamicModule {
    // Load the configuration file
    const configs = this.getConfigs(path);
    const imports: DynamicModule[] = [];

    // Connect to each MongoDB database based on the configuration
    configs.forEach((config) => {
      const { connectionName, uri, options } = config;
      const module = MongooseModule.forRoot(uri, {
        ...options,
        connectionName,
      });

      imports.push(module);
    });

    return {
      module: MongooseConnectModule,
      imports: imports,
    };
  }
}
