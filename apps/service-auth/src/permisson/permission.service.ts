import { CreateMerchantRoleDto } from './dtos/permission.dto';
import { MerchantRoleDocument } from './schemas/merchant-role.schema';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetRoleResponse,
  GetRolesResponse,
} from '@skygate/protobuf/protobufs/merchant-role.pb';
import assert from 'assert';
import { Model } from 'mongoose';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(MerchantRoleDocument.name, 'DB_AUTH')
    private readonly merchantRoleModel: Model<MerchantRoleDocument>,
  ) {}

  /**
   * Creates a merchant role.
   * @param dto The data transfer object containing the role information.
   * @returns The created role as a JSON object.
   */
  async createMerchantRole(dto: CreateMerchantRoleDto) {
    const role = await this.merchantRoleModel.create(dto);
    Logger.log(`Created role ${role.name}`);
    return role.toJSON();
  }

  /**
   * Retrieves a merchant role by its ID.
   * @param id - The ID of the merchant role.
   * @returns The merchant role object.
   * @throws NotFoundException if the role is not found.
   */
  async getMerchantRoleById(id: string) {
    const role = await this.merchantRoleModel.findById(id);
    assert.ok(role, new NotFoundException('Role not found'));
    return role.toJSON() as GetRoleResponse;
  }

  /**
   * Retrieves merchant roles by their IDs.
   * @param ids - An array of role IDs.
   * @returns An object containing the retrieved roles.
   */
  async getMerchantRolesByIds(ids: string[]) {
    const roles = await this.merchantRoleModel.find({ _id: { $in: ids } });
    const rolesJSON = roles.map((role) => role.toJSON() as GetRoleResponse);
    return { roles: rolesJSON } as GetRolesResponse;
  }
}
