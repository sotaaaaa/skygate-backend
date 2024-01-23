import { Injectable } from '@nestjs/common';
import { ClientGrpcService } from '@skygate/plugins';
import {
  AUTH_MERCHANT_SERVICE_NAME,
  AuthMerchantClient,
} from '@skygate/protobuf/protobufs/auth-merchant.pb';
import {
  MERCHANT_ROLE_SERVICE_NAME,
  MerchantRoleClient,
} from '@skygate/protobuf/protobufs/merchant-role.pb';
import { MerchantInterface } from '@skygate/shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthzService {
  @ClientGrpcService('ServiceAuth', MERCHANT_ROLE_SERVICE_NAME)
  private readonly merchantRole: MerchantRoleClient;

  @ClientGrpcService('ServiceAuth', AUTH_MERCHANT_SERVICE_NAME)
  private readonly authMerchant: AuthMerchantClient;

  /**
   * Lấy tất cả các quyền của một merchant dựa trên mã merchant.
   * @param merchant Mã của merchant.
   * @returns Mảng chứa tất cả các quyền của merchant.
   */
  async getAllPermissions(merchant: MerchantInterface) {
    // Sau khi lấy được thông tin merchant, lấy thông tin role của merchant
    const response = await firstValueFrom(
      this.merchantRole.getMerchantRoleByIds({ ids: merchant.roles }),
    );
    const roles = response.roles || [];

    // Lấy tất cả các permission của merchant
    const permissions = roles.map((role) => role.permissions).flat();
    return permissions;
  }
}
