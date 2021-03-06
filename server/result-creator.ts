/**
 * 41 - 用戶
 * 42 - 產品
 * 43 - 訂單
 */

 interface IResultFlags {
  SUCCESS: number;
  PARAM_ERROR: number;
  UNAUTHENTICATION: number;
  USER_NOT_LOGIN: number;
  NEED_ADMIN_PERMISSION: number;
  USER_NOT_FOUND: number;
  USER_EXIST: number;
  WRONG_USER_OR_PASSWORD: number;
  USER_TRY_GOOGLE: number;
  USER_MONEY_ENOUGH: number;
  PRODUCT_EXIST: number;
  PRODUCT_NOT_FOUND: number;
  ORDER_NOT_FOUND: number;
  ORDER_DATA_ERROR: number;
  MESSAGE_SEND_FAIL: number;
  UNEXPECTED_ERROR: number;
}

export const ResultCode : IResultFlags = {
  SUCCESS: 200,
  PARAM_ERROR: 400,
  UNAUTHENTICATION: 401,
  USER_NOT_LOGIN: 402,
  NEED_ADMIN_PERMISSION: 403,
  USER_NOT_FOUND: 404,
  USER_EXIST: 410,
  WRONG_USER_OR_PASSWORD: 411,
  USER_TRY_GOOGLE: 412,
  USER_MONEY_ENOUGH: 414,
  PRODUCT_EXIST: 420,
  PRODUCT_NOT_FOUND: 421,
  ORDER_NOT_FOUND: 431,
  ORDER_DATA_ERROR: 432,
  MESSAGE_SEND_FAIL: 441,
  UNEXPECTED_ERROR: 500,
};

interface IResultMessage {
  [code: number]: string;
}

const ResultCodeMessage: IResultMessage = {
  200: "成功",
  400: "參數錯誤",
  401: "權限不足",
  402: "用戶未登入",
  403: "只有管理員能進行此操作",
  404: "未找到用戶",
  410: "用戶已存在",
  411: "錯誤的email或密碼",
  412: "請嘗試使用Google帳號登入",
  414: "儲值金不足",
  420: "該產品已存在",
  421: "該產品不存在",
  431: "該訂單不存在",
  432: "訂單產品或會員不存在",
  441: "訊息傳送失敗",
  500: "未預期的錯誤",
};

export class ResultObject {
  code: number;
  message: string;
  data: object | null | undefined;

  constructor(code: number, data?: object) {
    this.code = code;
    this.message = ResultCodeMessage[code];
    this.data = data;
  }
}
