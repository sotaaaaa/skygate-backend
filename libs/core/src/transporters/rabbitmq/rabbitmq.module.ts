import _ from 'lodash';

import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppUtils } from '@skygate/shared';

@Global()
@Module({})
export class RabbitMQExtraModule {
  /**
   * Get the RabbitMQ configurations from the provided configuration file.
   * @param path The path to the configuration file.
   * @returns An array of RabbitMQ configurations.
   */
  static getConfigs(path: string) {
    // Read the configuration file
    // Render the configuration file using environment variables
    const rootConfigs = AppUtils.loadYamlFile(path) || {};

    // Check if root configurations exist
    if (!rootConfigs) {
      Logger.log("Can't find root configs");
      return;
    }

    // Extract the RabbitMQ configurations
    const { transporters } = rootConfigs || {};
    const { amqp } = transporters || {};

    return amqp || {};
  }

  /**
   * Create a dynamic module for the RabbitMQ module.
   * @param path The path to the configuration file.
   * @returns A dynamic module for the RabbitMQ module.
   */
  static forRoot(path: string): DynamicModule {
    // Load the configuration file
    const configs = this.getConfigs(path);

    // Extract the enable and options properties from the configurations
    const isEnable = _.get(configs, 'enable', false);
    const rabbitMQOptions = _.get(configs, 'options', {});

    // Create an array of dynamic modules to import
    const imports: DynamicModule[] = [
      RabbitMQModule.forRoot(RabbitMQModule, rabbitMQOptions),
    ];

    return {
      module: RabbitMQExtraModule,
      imports: isEnable ? imports : [],
      exports: isEnable ? [RabbitMQModule] : [],
    };
  }
}
