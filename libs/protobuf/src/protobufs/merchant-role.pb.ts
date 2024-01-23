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
export interface GetRolesRequest {
  ids: string[];
}

export interface GetRoleRequest {
  id: string;
}

export interface GetRoleResponse {
  Id: string;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
}

export interface GetRolesResponse {
  roles: GetRoleResponse[];
}

export const COM_SKYGATE_SERVICE_AUTH_PACKAGE_NAME = "com.skygate.service.auth";

function createBaseGetRolesRequest(): GetRolesRequest {
  return { ids: [] };
}

export const GetRolesRequest = {
  encode(message: GetRolesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRolesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRolesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ids.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRolesRequest {
    return { ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.String(e)) : [] };
  },

  toJSON(message: GetRolesRequest): unknown {
    const obj: any = {};
    if (message.ids?.length) {
      obj.ids = message.ids;
    }
    return obj;
  },
};

function createBaseGetRoleRequest(): GetRoleRequest {
  return { id: "" };
}

export const GetRoleRequest = {
  encode(message: GetRoleRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRoleRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRoleRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRoleRequest {
    return { id: isSet(object.id) ? globalThis.String(object.id) : "" };
  },

  toJSON(message: GetRoleRequest): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },
};

function createBaseGetRoleResponse(): GetRoleResponse {
  return { Id: "", name: "", description: "", permissions: [], isActive: false };
}

export const GetRoleResponse = {
  encode(message: GetRoleResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Id !== "") {
      writer.uint32(10).string(message.Id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    for (const v of message.permissions) {
      writer.uint32(34).string(v!);
    }
    if (message.isActive === true) {
      writer.uint32(40).bool(message.isActive);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRoleResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRoleResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.permissions.push(reader.string());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.isActive = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRoleResponse {
    return {
      Id: isSet(object.Id) ? globalThis.String(object.Id) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      permissions: globalThis.Array.isArray(object?.permissions)
        ? object.permissions.map((e: any) => globalThis.String(e))
        : [],
      isActive: isSet(object.isActive) ? globalThis.Boolean(object.isActive) : false,
    };
  },

  toJSON(message: GetRoleResponse): unknown {
    const obj: any = {};
    if (message.Id !== "") {
      obj.Id = message.Id;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.permissions?.length) {
      obj.permissions = message.permissions;
    }
    if (message.isActive === true) {
      obj.isActive = message.isActive;
    }
    return obj;
  },
};

function createBaseGetRolesResponse(): GetRolesResponse {
  return { roles: [] };
}

export const GetRolesResponse = {
  encode(message: GetRolesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.roles) {
      GetRoleResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRolesResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRolesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roles.push(GetRoleResponse.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRolesResponse {
    return {
      roles: globalThis.Array.isArray(object?.roles) ? object.roles.map((e: any) => GetRoleResponse.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetRolesResponse): unknown {
    const obj: any = {};
    if (message.roles?.length) {
      obj.roles = message.roles.map((e) => GetRoleResponse.toJSON(e));
    }
    return obj;
  },
};

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface MerchantRoleClient {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  getMerchantRoleByIds(request: GetRolesRequest): Observable<GetRolesResponse>;

  getMerchantRoleById(request: GetRoleRequest): Observable<GetRoleResponse>;
}

/**
 * Định nghĩa tất cả các phương thức RPC cho dịch vụ.
 * Các hàm được định nghĩa theo định dạng sau:
 * rpc <tên_hàm>(<tin_nhắn_yêu_cầu>) returns (<tin_nhắn_phản_hồi>) {}
 */

export interface MerchantRoleController {
  /**
   * HealthCheck là một phương thức RPC đơn lẻ kiểm tra trạng thái sức khỏe của dịch vụ
   * cổng.
   * @param Empty - Một tin nhắn yêu cầu trống.
   * @return HealthCheckResponse - Tin nhắn phản hồi chứa trạng thái sức khỏe của dịch vụ
   * cổng.
   */

  getMerchantRoleByIds(
    request: GetRolesRequest,
  ): Promise<GetRolesResponse>

  getMerchantRoleById(
    request: GetRoleRequest,
  ): Promise<GetRoleResponse>
}

export function MerchantRoleControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getMerchantRoleByIds", "getMerchantRoleById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MerchantRole", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MerchantRole", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MERCHANT_ROLE_SERVICE_NAME = "MerchantRole";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
