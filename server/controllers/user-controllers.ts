import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ResultObject, ResultCode } from "../result-creator";
const User = require("../models/user-model");

module.exports.register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const { username, email, password, sex } = req.body;
    let result: ResultObject;
    const emailCheck = await User.findOne({ USER_EMAIL: email });
    if (emailCheck) {
      result = new ResultObject(ResultCode.USER_EXIST);
      console.log(result);
      return res.json(result);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      USER_EMAIL: email,
      USER_NAME: username,
      USER_PW: hashedPassword,
      USER_SEX: sex,
    });
    // 無法直接對mongoose的物件進行操作，因次創建一個新物件
    const resUser = {
        ...user._doc,
        USER_PW: undefined,
        USER_POINT:undefined,
        USER_REPORT:undefined
    };
    result = new ResultObject(ResultCode.SUCCESS, resUser);
    console.log(result);
    return res.json(result);
  } catch (err: any) {
    console.log(err.response);
    next(err);
  }
};

module.exports.login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const {  email, password } = req.body;
    let result: ResultObject;
    const findUser = await User.findOne({ USER_EMAIL: email });
    if (!findUser) {
      result = new ResultObject(ResultCode.WRONG_USER_OR_PASSWORD);
      console.log(result);
      return res.json(result);
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.USER_PW);
    if (!isPasswordValid){
      result = new ResultObject(ResultCode.WRONG_USER_OR_PASSWORD);
      console.log(result);
      return res.json(result);
    }
    // 無法直接對mongoose的物件進行操作，因次創建一個新物件
    const resUser = {
        ...findUser._doc,
        USER_PW: undefined,
        USER_POINT:undefined,
        USER_REPORT:undefined
    };
    result = new ResultObject(ResultCode.SUCCESS, resUser);
    console.log(result);
    return res.json(result);
  } catch (err: any) {
    console.log(err.response);
    next(err);
  }
};
