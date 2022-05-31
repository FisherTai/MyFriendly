import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ResultObject, ResultCode } from "../result-creator";
import jwt from "jsonwebtoken";

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
      return resJson(res, new ResultObject(ResultCode.USER_EXIST));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      USER_EMAIL: email,
      USER_NAME: username,
      USER_PW: hashedPassword,
      USER_SEX: sex,
    });
    // 建立token
    const tokenObject = {
      _id: user._id,
      USER_SEX: user.USER_SEX,
    };
    const token = jwt.sign(tokenObject, process.env.SECRET!, { expiresIn: '7 day' });

    const maxAge = 3 * 24 * 60 * 60;
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // 無法直接對mongoose的物件進行操作，因次創建一個新物件
    const resUser = {
      ...user._doc,
      USER_PW: undefined,
      USER_POINT: undefined,
      USER_REPORT: undefined,
    };
    return resJson(res, new ResultObject(ResultCode.SUCCESS, resUser));
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
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ USER_EMAIL: email });
    if (!findUser) {
      return resJson(res, new ResultObject(ResultCode.WRONG_USER_OR_PASSWORD));
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.USER_PW);
    if (!isPasswordValid) {
      return resJson(res, new ResultObject(ResultCode.WRONG_USER_OR_PASSWORD));
    }

    //建立token
    const tokenObject = {
      _id: findUser._id,
      USER_SEX: findUser.USER_SEX,
      expiresIn: "7d",
    };
    const token = jwt.sign(tokenObject, process.env.SECRET!);

    const maxAge = 3 * 24 * 60 * 60;
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // 無法直接對mongoose的物件進行操作，因次創建一個新物件
    const resUser = {
      ...findUser._doc,
      USER_PW: undefined,
      USER_POINT: undefined,
      USER_REPORT: undefined,
      JWT: token,
    };
    return resJson(res, new ResultObject(ResultCode.SUCCESS, resUser));
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

module.exports.getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "USER_EMAIL",
      "USER_NAME",
      "USER_SEX",
      "USER_AVATAR",
      "_id",
    ]);
    return resJson(res, new ResultObject(ResultCode.SUCCESS, users));
  } catch (ex) {
    next(ex);
  }
};

module.exports.logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id)
      return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
    onlineUsers.delete(req.params.id);
    //因為cookie設置為httpOnly，因此要從後端再次設置覆蓋
    res.cookie("jwt", "", {
      expires: new Date(Date.now() + 1 * 1000), //重新設置過期時間
      httpOnly: true, //或是設置為false，然後在前端將其清除
    });
    customLog("logout","logout success");
    return res.send(new ResultObject(ResultCode.SUCCESS));
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject, tag?: string) => {
  customLog(tag ? tag : "", JSON.stringify(result));
  return res.send(result);
};
