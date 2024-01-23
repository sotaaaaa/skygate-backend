import { MerchantActions, MerchantSubjects } from '../enums/merchant-casl.enum';
import { PureAbility, SubjectRawRule } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthzService } from '../authz.service';
import { MerchantPermissionContants } from '@skygate/auth/authz/constants';
import { MerchantInterface } from '@skygate/shared';
import assert from 'assert';

// Subjects is feature
export type AppAbility = PureAbility<[MerchantActions, MerchantSubjects]>;
export type SubjectRule = SubjectRawRule<MerchantActions, never, unknown>;

/**
 * Factory class for creating CaslAbility instances.
 */
@Injectable()
export class MerchantCaslAbilityFactory {
  constructor(private readonly authzService: AuthzService) {}

  /**
   * Creates a CaslAbility instance for a specific merchant.
   * @param merchantCode The merchant code of the merchant.
   * @returns A Promise that resolves to a new CaslAbility instance.
   */
  async createForMerchant(merchant: MerchantInterface) {
    const permissionIds = await this.authzService.getAllPermissions(merchant);

    // Convert permissionIds to CaslPermission
    const caslPermission = permissionIds.map((id) => {
      const permission = MerchantPermissionContants.find((p) => p.id == id);

      // Check permission is exist
      assert.ok(permission, new ForbiddenException(`Permission ${id} is not exist`));

      // Return action and subject
      return {
        action: permission.action,
        subject: permission.subject,
      };
    });

    return new PureAbility<[MerchantActions, MerchantSubjects]>(caslPermission);
  }
}
