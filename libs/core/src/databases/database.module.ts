import { MongooseConnectModule } from './mongoose/mongoose.module';
import { DynamicModule, Global, Module } from '@nestjs/common';

export enum DatabaseTypes {
  MONGOOSE = 'mongoose',
}

export type DatabaseModuleOptions = {
  allows: DatabaseTypes[];
};

/**
 * Represents a module for managing databases.
 */
@Global()
@Module({})
export class DatabaseModule {
  /**
   * Creates a dynamic module for the database module.
   * @param path - The path to the database.
   * @param options - The options for the database module.
   * @returns A dynamic module for the database module.
   */
  static forRoot(path: string, options: DatabaseModuleOptions): DynamicModule {
    const imports: DynamicModule[] = [];

    // Allow mongoose
    if (options.allows.includes(DatabaseTypes.MONGOOSE)) {
      imports.push(MongooseConnectModule.connect(path));
    }

    return {
      module: DatabaseModule,
      imports: imports,
    };
  }
}
