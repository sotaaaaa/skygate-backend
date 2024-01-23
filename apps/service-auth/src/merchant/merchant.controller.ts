import { MerchantLoginDto, MerchantRefreshTokenDto } from '../auth/dtos/auth.dto';
import { MerchantAuthService } from './../auth/merchant.auth';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import {
  AuthMerchantController,
  AuthMerchantControllerMethods,
  AuthMerchantResponse,
  CreateMerchantRequest,
  GetAndDeleteMerchantRequest,
  GetMerchantByUsernameRequest,
  ValidateAccessTokenRequest,
} from '@skygate/protobuf/protobufs/auth-merchant.pb';
import { ServiceToClient, ServiceToService } from '@skygate/core';

@Controller('merchant')
@AuthMerchantControllerMethods()
export class MerchantController implements AuthMerchantController {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly merchantAuthService: MerchantAuthService,
  ) {}

  // Create a new merchant
  @ServiceToService()
  createMerchant(request: CreateMerchantRequest): Promise<AuthMerchantResponse> {
    return this.merchantService.createMerchant(request);
  }

  // Delete a merchant
  @ServiceToService()
  deleteMerchantByCode(
    request: GetAndDeleteMerchantRequest,
  ): Promise<AuthMerchantResponse> {
    return this.merchantService.deleteMerchantByCode(request);
  }

  // Get a merchant
  @ServiceToService()
  getMerchantByCode(request: GetAndDeleteMerchantRequest): Promise<AuthMerchantResponse> {
    return this.merchantService.getMerchantByCode(request);
  }

  // Get merchant by username
  @ServiceToService()
  getMerchantByUsername(
    request: GetMerchantByUsernameRequest,
  ): Promise<AuthMerchantResponse> {
    return this.merchantService.getMerchantByUsername(request);
  }

  // Validate access token
  @ServiceToService()
  validateAccessToken(
    request: ValidateAccessTokenRequest,
  ): Promise<AuthMerchantResponse> {
    return this.merchantAuthService.resolveAccessToken(request.accessToken);
  }

  // Api merchant login
  @Post('/login')
  @ServiceToClient()
  async merchantLogin(@Body() dto: MerchantLoginDto) {
    Logger.log(`Login merchant ${dto.username}`, 'MerchantController');
    const response = await this.merchantAuthService.merchantLogin(dto);
    return response;
  }

  // Merchant refresh token
  @Post('/refresh-token')
  @ServiceToClient()
  async merchantRefreshToken(@Body() dto: MerchantRefreshTokenDto) {
    Logger.log(`Refresh token merchant`);
    const response = await this.merchantAuthService.createAccessTokenFromRefreshToken(
      dto.refreshToken,
    );

    Logger.log(`Refresh token merchant ${response.merchant.username}`);
    return response;
  }
}
