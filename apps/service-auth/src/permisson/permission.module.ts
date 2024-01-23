import { MerchantRoleDocument, MerchantRoleSchema } from './schemas/merchant-role.schema';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: MerchantRoleDocument.name, schema: MerchantRoleSchema }],
      'DB_AUTH',
    ),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
