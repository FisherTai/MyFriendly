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
    const emailCheck = await User.findOne({ USER_EMAIL: email });
    if (emailCheck) {
      return resJson(res,new ResultObject(ResultCode.USER_EXIST));
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
      USER_POINT: undefined,
      USER_REPORT: undefined,
    };
    return resJson(res,new ResultObject(ResultCode.SUCCESS, resUser));
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
    const { email, password } = req.body;
    const findUser = await User.findOne({ USER_EMAIL: email });
    if (!findUser) {
      return resJson(res,new ResultObject(ResultCode.WRONG_USER_OR_PASSWORD));
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.USER_PW);
    if (!isPasswordValid) {
      return resJson(res,new ResultObject(ResultCode.WRONG_USER_OR_PASSWORD));
    }
    // 無法直接對mongoose的物件進行操作，因次創建一個新物件
    const resUser = {
      ...findUser._doc,
      USER_PW: undefined,
      USER_POINT: undefined,
      USER_REPORT: undefined,
    };
    return resJson(res,new ResultObject(ResultCode.SUCCESS, resUser));
  } catch (err: any) {
    console.log(err.response);
    next(err);
  }
};

module.exports.setAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        USER_AVATAR: avatarImage,
      },
      { new: true }
    );
    return resJson(
      res,
      new ResultObject(ResultCode.SUCCESS, {
        isSet: userData.isAvatarImageSet(),
        image: userData.USER_AVATAR,
      })
    );
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject) => {
  console.log(result);
  return res.send(result);
};
