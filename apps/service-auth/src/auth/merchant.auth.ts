import { MerchantLoginDto } from './dtos/auth.dto';
import { ConfigService } from '@nestjs/config';
import { MerchantService } from '../merchant/merchant.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import assert from 'assert';
import _ from 'lodash';
import { AuthMerchantResponse } from '@skygate/protobuf/protobufs/auth-merchant.pb';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

export interface AccessTokenPayload {
  code: string;
  id: string;
}

@Injectable()
export class MerchantAuthService {
  constructor(
    private readonly merchantRefreshToken: RefreshTokenService,
    private readonly jwt: JwtService,
    private readonly merchantService: MerchantService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a merchant access token for the given code.
   * @param code - The code of the merchant.
   * @returns The generated access token.
   */
  async generateMerchantAccessToken(code: string) {
    const merchant = await this.merchantService.getMerchantByCode({ code });
    const secret = this.configService.get<string>('configs.jwt_secret');
    const expiresIn = this.configService.get<number>('configs.jwt_token_expires_in');

    // Check if the merchant exists.
    assert.ok(merchant, new NotFoundException('Merchant not found'));

    // Generate the access token.
    const accessToken = this.jwt.sign(
      { code: merchant.code, id: merchant.username },
      { secret, expiresIn },
    );

    Logger.log(`Generated access token for ${merchant.code}`);
    return accessToken;
  }

  /**
   * Tạo mã thông báo làm mới cho người bán.
   * @param code Tên người dùng của người bán.
   * @returns Mã thông báo làm mới.
   */
  async generateMerchantRefreshToken(code: string) {
    const merchant = await this.merchantService.getMerchantByCode({ code });
    const expiresIn = this.configService.get('configs.jwt_refresh_token_expires_in');
    const refreshToken = await this.merchantRefreshToken.createMerchantRefreshToken(
      merchant.code,
      expiresIn,
    );
    const options: SignOptions = {
      subject: code,
      jwtid: refreshToken.code,
    };

    Logger.log(`[JWT] Generate refresh token for merchant ${code}`);
    return this.jwt.sign({}, options);
  }

  /**
   * Giải mã access token
   * @param encoded
   * @returns
   */
  public async resolveRefreshToken(encoded: string) {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromMerchantRefreshTokenPayload(payload);

    //- Check is exist refresh token
    assert.ok(token, new UnauthorizedException('Refresh token not found'));
    assert.ok(!token.isRevoked, new UnauthorizedException('Refresh token revoked'));

    //- Get merchant info by token payload
    const merchant = await this.getMerchantFromRefreshTokenPayload(payload);
    assert.ok(merchant, new UnauthorizedException('Refresh token malformed'));

    Logger.log(`[JWT] Resolve refresh token for merchant`);
    return { merchant, token };
  }

  /**
   * Get refresh token from payload
   * @param payload
   * @returns
   */
  private async getStoredTokenFromMerchantRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ) {
    const code = payload.jti;
    assert.ok(code, new UnauthorizedException('Refresh token malformed'));

    Logger.log(`[JWT] Get refresh token from payload`);
    return this.merchantRefreshToken.getByCode(code);
  }

  /**
   * Lấy thông tin merchant từ payload của access token.
   * @param payload - Payload của access token.
   * @returns Thông tin merchant.
   */
  private async getMerchantFromAccessTokenPayload(payload: AccessTokenPayload) {
    const code = payload.code;
    assert.ok(code, new UnauthorizedException('Access token malformed'));

    Logger.log(`[JWT] Get merchant from access token payload`);
    return this.merchantService.getMerchantByCode({ code });
  }

  /**
   * Giải mã refresh token
   * @param token
   * @returns
   */
  public async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwt.verify(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Refresh token malformed');
    }
  }

  /**
   * Get merchant info by token payload
   * @param payload
   * @returns
   */
  private async getMerchantFromRefreshTokenPayload(payload: RefreshTokenPayload) {
    assert.ok(payload.sub, new UnauthorizedException('Refresh token malformed'));
    return this.merchantService.getMerchantByCode({ code: payload.sub });
  }

  /**
   * Đăng nhập của merchant.
   * @param dto - Đối tượng chứa thông tin đăng nhập của merchant.
   * @returns - Đối tượng chứa access token và refresh token cho merchant.
   */
  async merchantLogin(dto: MerchantLoginDto) {
    const merchant = await this.merchantService.getMerchantByUsername({
      username: dto.username,
    });
    assert.ok(merchant, new UnauthorizedException('Wrong login information'));

    // Kiểm tra mật khẩu có đúng không
    const isValidate = await this.merchantService.validateCredentials(
      dto.password,
      merchant.password,
    );
    assert.ok(isValidate, new UnauthorizedException('Wrong login information'));
    Logger.log(`[merchantLogin] Merchant ${merchant.username} password is passed`);

    // Tạo access token
    const merchantCode = merchant.code;
    const tokenExpiresIn = this.configService.get('configs.jwt_token_expires_in');
    const refreshTokenExpiresIn = this.configService.get(
      'configs.jwt_refresh_token_expires_in',
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.generateMerchantAccessToken(merchantCode),
      this.generateMerchantRefreshToken(merchantCode),
    ]);
    Logger.log(`[merchantLogin] Merchant ${merchantCode} access token is generated`);

    // Trả về access token và refresh token cho merchant
    const response = {
      accessToken: {
        value: accessToken,
        expiresIn: new Date(Date.now() + tokenExpiresIn),
      },
      refreshToken: {
        value: refreshToken,
        expiresIn: new Date(Date.now() + refreshTokenExpiresIn),
      },
    };

    Logger.log(`[JWT] Generate access token for merchant ${merchantCode}`);
    return response;
  }

  /**
   * Tạo access token từ refresh token
   * @param refresh
   * @returns
   */
  public async createAccessTokenFromRefreshToken(refresh: string) {
    const { merchant } = await this.resolveRefreshToken(refresh);
    const accessToken = await this.generateMerchantAccessToken(merchant.username);
    const expriesIn = Date.now() + this.configService.get('configs.jwt_token_expires_in');

    Logger.log(`[JWT] Create access token from refresh token for merchant`);
    return {
      merchant: _.omit(merchant, ['password', 'status']),
      accessToken: { value: accessToken, expiresIn: new Date(expriesIn) },
    };
  }

  /**
   * Giải mã access token.
   * @param token - Access token cần giải mã.
   * @returns Access token đã được giải mã.
   * @throws UnauthorizedException nếu access token hết hạn hoặc không đúng định dạng.
   */
  public async decodeAccessToken(token: string) {
    try {
      return this.jwt.verify(token, {
        secret: this.configService.get('configs.jwt_secret'),
        maxAge: this.configService.get('configs.jwt_token_expires_in'),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(error.message || 'Access token expired');
      }
      throw new UnauthorizedException(error.message || 'Access token malformed');
    }
  }

  /**
   * Giải quyết mã truy cập để lấy thông tin người bán.
   * @param token - Mã truy cập cần giải mã.
   * @returns - Đối tượng người bán liên quan đến mã truy cập.
   */
  public async resolveAccessToken(token: string) {
    const accessToken = this.convertBearerTokenToToken(token);
    const payload = await this.decodeAccessToken(accessToken);
    const merchant = await this.getMerchantFromAccessTokenPayload(payload);
    assert.ok(merchant, new UnauthorizedException('Access token malformed'));

    Logger.log(`[JWT] Resolve access token for merchant`);
    return merchant as AuthMerchantResponse;
  }

  // Chuyển đổi token dạng Brearer thành token thường
  public convertBearerTokenToToken(token: string) {
    return token.replace('Bearer ', '');
  }
}
