import { Model } from 'mongoose';
import { MerchantRefreshTokenDocument } from './schemas/merchant-refresh-token.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(MerchantRefreshTokenDocument.name, 'DB_AUTH')
    private readonly merchantRefreshTokenModel: Model<MerchantRefreshTokenDocument>,
  ) {}

  /**
   * Creates a new merchant refresh token.
   * @param code - The code of the merchant.
   * @param ttl - The time to live (in milliseconds) for the refresh token.
   * @returns The newly created refresh token.
   */
  async createMerchantRefreshToken(code: string, ttl: number) {
    const expiration = new Date().getTime();
    const refreshToken = await this.merchantRefreshTokenModel.findOneAndUpdate(
      { code, isRevoked: false },
      { expires: expiration + ttl },
      { new: true, upsert: true },
    );
    return refreshToken;
  }

  /**
   * Retrieves a refresh token by code.
   * @param code - The code of the merchant.
   * @returns The refresh token.
   */
  async getByCode(code: string) {
    const refreshToken = await this.merchantRefreshTokenModel.findOne({ code });
    return refreshToken;
  }

  /**
   * Retrieves a refresh token by ID.
   * @param id - The ID of the refresh token.
   * @returns The refresh token.
   */
  async getById(id: string) {
    const refreshToken = await this.merchantRefreshTokenModel.findById(id);
    return refreshToken;
  }
}
