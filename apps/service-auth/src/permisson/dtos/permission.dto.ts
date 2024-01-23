import { IsArray, IsString } from 'class-validator';

export class CreateMerchantRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @IsString()
  depscription: string;
}
