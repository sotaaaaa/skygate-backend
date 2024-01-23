/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import * as _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";

export const protobufPackage = "com.skygate.service.auth";

/**
 * Bắt đầu định nghĩa các tin nhắn phản hồi.
 * Các tin nhắn phản hồi được định nghĩa theo định dạng sau:
 * message <tên_tin_nhắn_phản_hồi> {
 */
export interface CreateMerchantRequest {
  username: string;
  password: string;
  email?: string | undefined;
  phone?: string | undefined;
  code: string;
}

export interface GetAndDeleteMerchantRequest {
  code: string;
}

export interface GetMerchantByUsernameRequest {
  username: string;
}

export interface ValidateAccessTokenRequest {
  accessToken: string;
}

export interface AuthMerchantResponse {
  username: string;
  email: string;
  phone: string;
  roles: string[];
  status: string;
  password: string;
  code: string;
}

export const COM_SKYGATE_SERVICE_AUTH_PACKAGE_NAME = "com.skygate.service.auth";

function createBaseCreateMerchantRequest(): CreateMerchantRequest {
  return { username: "", password: "", code: "" };
}

export const CreateMerchantRequest = {
  encode(message: CreateMerchantRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    if (message.email !== undefined) {
      writer.uint32(26).string(message.email);
    }
    if (message.phone !== undefined) {
      writer.uint32(34).string(message.phone);
    }
    if (message.code !== "") {
      writer.uint32(42).string(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateMerchantRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateMerchantRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.email = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.phone = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.code = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateMerchantRequest {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : undefined,
      phone: isSet(object.phone) ? globalThis.String(object.phone) : undefined,
      code: isSet(object.code) ? globalThis.String(object.code) : "",
    };
  },

  toJSON(message: CreateMerchantRequest): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    if (message.email !== undefined) {
      obj.email = message.email;
    }
    if (message.phone !== undefined) {
      obj.phone = message.phone;
    }
    if (message.code !== "") {
      obj.code = message.code;
    }
    return obj;
  },
};

function createBaseGetAndDeleteMerchantRequest(): GetAndDeleteMerchantRequest {
  return { code: "" };
}

export const GetAndDeleteMerchantRequest = {
  encode(message: GetAndDeleteMerchantRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== "") {
      writer.uint32(10).string(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAndDeleteMerchantRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAndDeleteMerchantRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.code = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAndDeleteMerchantRequest {
    return { code: isSet(object.code) ? globalThis.String(object.code) : "" };
  },

  toJSON(message: GetAndDeleteMerchantRequest): unknown {
    const obj: any = {};
    if (message.code !== "") {
      obj.code = message.code;
    }
    return obj;
  },
};

function createBaseGetMerchantByUsernameRequest(): GetMerchantByUsernameRequest {
  return { username: "" };
}

export const GetMerchantByUsernameRequest = {
  encode(message: GetMerchantByUsernameRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMerchantByUsernameRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMerchantByUsernameRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetMerchantByUsernameRequest {
    return { username: isSet(object.username) ? globalThis.String(object.username) : "" };
  },

  toJSON(message: GetMerchantByUsernameRequest): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    return obj;
  },
};

function createBaseValidateAccessTokenRequest(): ValidateAccessTokenRequest {
  return { accessToken: "" };
}

export const ValidateAccessTokenRequest = {
  encode(message: ValidateAccessTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessToken !== "") {
      writer.uint32(10).string(message.accessToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateAccessTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateAccessTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accessToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ValidateAccessTokenRequest {
    return { accessToken: isSet(object.accessToken) ? globalThis.String(object.accessToken) : "" };
  },

  toJSON(message: ValidateAccessTokenRequest): unknown {
    const obj: any = {};
    if (message.accessToken !== "") {
      obj.accessToken = message.accessToken;
    }
    return obj;
  },
};

function createBaseAuthMerchantResponse(): AuthMerchantResponse {
  return { username: "", email: "", phone: "", roles: [], status: "", password: "", code: "" };
}

export const AuthMerchantResponse = {
  encode(message: AuthMerchantResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.phone !== "") {
      writer.uint32(26).string(message.phone);
    }
    for (const v of message.roles) {
      writer.uint32(34).string(v!);
    }
    if (message.status !== "") {
      writer.uint32(42).string(message.status);
    }
    if (message.password !== "") {
      writer.uint32(50).string(message.password);
    }
    if (message.code !== "") {
      writer.uint32(58).string(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthMerchantResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthMerchantResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.email = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.phone = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.roles.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.status = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.password = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.code = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthMerchantResponse {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      phone: isSet(object.phone) ? globalThis.String(object.phone) : "",
      roles: globalThis.Array.isArray(object?.roles) ? object.roles.map((e: any) => globalThis.String(e)) : [],
      status: isSet(object.status) ? globalThis.String(object.status) : "",
      password: isSet(object.password) ? globalThis.String(object.password) : "",
      code: isSet(object.code) ? globalThis.String(object.code) : "",
    };
  },

  toJSON(message: AuthMerchantResponse): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.phone !== "") {
      obj.phone = message.phone;
    }
    if (message.roles?.length) {
      obj.roles = message.roles;
    }
    if (message.status !== "") {
      obj.status = message.status;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    if (message.code !== "") {
      obj.code = message.code;
    }
    return obj;
  },
};

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface AuthMerchantClient {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  createMerchant(request: CreateMerchantRequest): Observable<AuthMerchantResponse>;

  deleteMerchantByCode(request: GetAndDeleteMerchantRequest): Observable<AuthMerchantResponse>;

  getMerchantByUsername(request: GetMerchantByUsernameRequest): Observable<AuthMerchantResponse>;

  getMerchantByCode(request: GetAndDeleteMerchantRequest): Observable<AuthMerchantResponse>;

  validateAccessToken(request: ValidateAccessTokenRequest): Observable<AuthMerchantResponse>;
}

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface AuthMerchantController {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  createMerchant(
    request: CreateMerchantRequest,
  ): Promise<AuthMerchantResponse>

  deleteMerchantByCode(
    request: GetAndDeleteMerchantRequest,
  ): Promise<AuthMerchantResponse>

  getMerchantByUsername(
    request: GetMerchantByUsernameRequest,
  ): Promise<AuthMerchantResponse>

  getMerchantByCode(
    request: GetAndDeleteMerchantRequest,
  ): Promise<AuthMerchantResponse>

  validateAccessToken(
    request: ValidateAccessTokenRequest,
  ): Promise<AuthMerchantResponse>
}

export function AuthMerchantControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createMerchant",
      "deleteMerchantByCode",
      "getMerchantByUsername",
      "getMerchantByCode",
      "validateAccessToken",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthMerchant", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthMerchant", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_MERCHANT_SERVICE_NAME = "AuthMerchant";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
