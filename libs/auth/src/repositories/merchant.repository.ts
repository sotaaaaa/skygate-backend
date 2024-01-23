import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ClientGrpcService } from '@skygate/plugins';
import {
  AUTH_MERCHANT_SERVICE_NAME,
  AuthMerchantClient,
} from '@skygate/protobuf/protobufs/auth-merchant.pb';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MerchantRepository {
  @ClientGrpcService('ServiceAuth', AUTH_MERCHANT_SERVICE_NAME)
  private readonly authMerchant: AuthMerchantClient;

  /**
   * Validates the access token.
   * @param accessToken - The access token to validate.
   * @returns The validated merchant.
   */
  public async validateAccessToken(accessToken: string) {
    try {
      const merchant = await firstValueFrom(
        this.authMerchant.validateAccessToken({ accessToken }),
      );

      Logger.log(`Validate access token for ${merchant.username}`);
      return merchant;

      // The access token is invalid.
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
