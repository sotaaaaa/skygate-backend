import { Controller } from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  GetRoleRequest,
  GetRoleResponse,
  GetRolesRequest,
  GetRolesResponse,
  MerchantRoleController,
  MerchantRoleControllerMethods,
} from '@skygate/protobuf/protobufs/merchant-role.pb';
import { ServiceToService } from '@skygate/core';

@Controller('merchant')
@MerchantRoleControllerMethods()
export class PermissionController implements MerchantRoleController {
  constructor(private readonly permissionService: PermissionService) {}

  // RPC get merchant role by mongo ID
  @ServiceToService()
  async getMerchantRoleById(request: GetRoleRequest): Promise<GetRoleResponse> {
    return this.permissionService.getMerchantRoleById(request.id);
  }

  // RPC get merchant roles by mongo IDs
  @ServiceToService()
  async getMerchantRoleByIds(request: GetRolesRequest): Promise<GetRolesResponse> {
    return this.permissionService.getMerchantRolesByIds(request.ids);
  }
}
