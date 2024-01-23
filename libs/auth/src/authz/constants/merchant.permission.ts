import { MerchantActions, MerchantSubjects } from '@skygate/auth/authz/enums';

export type MerchantPermissionInterface = {
  id: string;
  action: MerchantActions;
  subject: MerchantSubjects;
};

export const MerchantPermissionContants: MerchantPermissionInterface[] = [
  {
    id: 'ManageAll',
    action: MerchantActions.MANAGE,
    subject: MerchantSubjects.ALL,
  },
];
