import { IsNotEmpty, IsString } from 'class-validator';

export class MerchantLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class MerchantRefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'The refresh token is required' })
  refreshToken: string;
}
