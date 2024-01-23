import { MerchantSubjects, MerchantActions } from '../enums/merchant-casl.enum';
import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMSSION_KEY = 'CHECK_PERMSSION_KEY';

export type MerchantRequiredPermission = [MerchantActions, MerchantSubjects];

/**
 * Decorator function that sets the required permissions for a merchant.
 * @param params The required permissions for the merchant.
 * @returns A decorator function that sets the metadata for the required permissions.
 */
export const MerchantCheckPermissions = (...params: MerchantRequiredPermission[]) =>
  SetMetadata(CHECK_PERMSSION_KEY, params);
