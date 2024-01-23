import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpcService } from '@skygate/plugins';
import {
  AUTH_MERCHANT_SERVICE_NAME,
  AuthMerchantClient,
} from '@skygate/protobuf/protobufs/auth-merchant.pb';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MerchantGuard implements CanActivate {
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

  /**
   * Determines if the user can activate the route.
   * @param context - The execution context.
   * @returns A boolean, a promise that resolves to a boolean, or an observable that emits a boolean indicating if the user can activate the route.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthorized = await this.validateToken(request);
    return isAuthorized;
  }

  /**
   * Validates the token in the request and attaches user information to the request user.
   * @param request - The incoming request object.
   * @returns A promise that resolves to a boolean indicating whether the request is authorized.
   */
  private async validateToken(request: Request): Promise<boolean> {
    const token = this.extractToken(request);

    // If the token is not found, the request is unauthorized
    if (!token) return false;

    // Attach user information to the request user
    const merchant = await this.validateAccessToken(token);
    request.user = merchant;

    // The request is authorized
    return true;
  }

  /**
   * Extracts the token from the request header.
   * @param request - The request object.
   * @returns The extracted token or null if not found.
   */
  private extractToken(request: Request): string | null {
    // Extract token logic from the request header
    return request.headers['authorization'] || null;
  }
}
