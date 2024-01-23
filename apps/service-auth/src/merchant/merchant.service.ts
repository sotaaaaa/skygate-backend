import { AuthMerchantDocument } from './schemas/merchant.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuthMerchantResponse,
  CreateMerchantRequest,
  GetAndDeleteMerchantRequest,
  GetMerchantByUsernameRequest,
} from '@skygate/protobuf/protobufs/auth-merchant.pb';
import { Model } from 'mongoose';
import { ErrorCodes, ErrorException } from '@skygate/core';
import bcrypt from 'bcrypt';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(AuthMerchantDocument.name, 'DB_AUTH')
    private readonly authMerchantModel: Model<AuthMerchantDocument>,
  ) {}

  /**
   * Creates a new merchant.
   * @param dto - The request object containing the merchant details.
   * @returns The created merchant object without the password field.
   */
  async createMerchant(dto: CreateMerchantRequest) {
    const password = await this.hashPassword(dto.password);
    const merchant = await this.authMerchantModel.create({ ...dto, password });

    Logger.log(`Created auth merchant ${merchant.username}`);
    return merchant as AuthMerchantResponse;
  }

  /**
   * Deletes a merchant from the database.
   * @param dto - The request object containing the username of the merchant to be deleted.
   * @returns The deleted merchant object without the password field.
   */
  async deleteMerchantByCode(dto: GetAndDeleteMerchantRequest) {
    const merchant = await this.authMerchantModel.findOneAndDelete({
      code: dto.code,
    });

    Logger.log(`Deleted auth merchant ${merchant.username}`);
    return merchant as AuthMerchantResponse;
  }

  /**
   * Get a merchant in the database.
   * @param dto - The request object containing the username of the merchant to be updated.
   * @returns The updated merchant object without the password field.
   */
  async getMerchantByCode(dto: GetAndDeleteMerchantRequest) {
    const merchant = await this.authMerchantModel.findOne({
      code: dto.code,
    });

    Logger.log(`Get auth merchant ${merchant.username}`);
    return merchant.toJSON() as AuthMerchantResponse;
  }

  /**
   * Get a merchant in the database.
   * @param dto - The request object containing the username of the merchant to be updated.
   * @returns The updated merchant object without the password field.
   */
  async getMerchantByUsername(dto: GetMerchantByUsernameRequest) {
    const merchant = await this.authMerchantModel.findOne({
      username: dto.username,
    });

    Logger.log(`Get auth merchant ${merchant.username}`);
    return merchant.toJSON() as AuthMerchantResponse;
  }

  /**
   * Hashes a password using bcrypt.
   * @param password - The password to be hashed.
   * @returns A promise that resolves to the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  /**
   * So sánh password có khớp với chuỗi password đã hash trong DB
   * @param password
   * @param hash
   * @returns
   */
  public async validateCredentials(password: string, hash: string) {
    try {
      return bcrypt.compare(password, hash);
    } catch (error) {
      throw new ErrorException({
        errorCode: ErrorCodes.HttpUnauthorized,
        message: 'Unauthorized',
      });
    }
  }
}
