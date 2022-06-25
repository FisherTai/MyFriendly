import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { ResultObject, ResultCode } from "../result-creator";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user-model";

export const register = async (
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
    const token = jwt.sign(tokenObject, process.env.SECRET!, {
      expiresIn: "7 day",
    });

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

export const login = async (
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

export const setAvatar = async (
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
    if (userData) {
      return resJson(
        res,
        new ResultObject(ResultCode.SUCCESS, {
          isSet: userData.isAvatarImageSet(),
          image: userData.USER_AVATAR,
        })
      );
    } else {
      return resJson(res, new ResultObject(ResultCode.UNEXPECTED_ERROR));
    }
  } catch (ex) {
    next(ex);
  }
};

export const getAllUsersExId = async (
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

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id)
      return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
    onlineUsers.delete(req.params.id);
    //因為cookie設置為httpOnly，因此要從後端再次設置覆蓋
    res.cookie("jwt", "", {
      expires: new Date(Date.now() + 1 * 1000), //重新設置過期時間
      httpOnly: true, //或是設置為false，然後在前端將其清除
    });
    customLog("logout", "logout success");
    return res.send(new ResultObject(ResultCode.SUCCESS));
  } catch (ex) {
    next(ex);
  }
};

export const getUserConcats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    if (!_id)
    return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
    const users = await User.findOne({ _id }).populate<{ USER_CONCATS: IUser[] }>('USER_CONCATS','USER_NAME USER_AVATAR').orFail().select(['USER_CONCATS']);
    return resJson(res, new ResultObject(ResultCode.SUCCESS, users!));
  } catch (ex) {
    next(ex);
  }
}

export const addConcats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    const objectId:string = req.body.objectId;
    if (!_id || !objectId){
      return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
    }
    const users = await User.findOneAndUpdate({ _id }, { $push: { USER_CONCATS : [ objectId ] } });
    return resJson(res, new ResultObject(ResultCode.SUCCESS));
  } catch (ex) {
    next(ex);
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select([
      "USER_EMAIL",
      "USER_NAME",
      "USER_SEX",
      "USER_AVATAR",
      "USER_SUSPENDED",
      "USER_CONCATS",
      "_id",
    ]);
    return resJson(res, new ResultObject(ResultCode.SUCCESS, users));
  } catch (ex) {
    next(ex);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    const user = await User.findOneAndUpdate({ _id},req.body,{
      new: true,
      runValidators: true,
    }).select([
      "USER_EMAIL",
      "USER_NAME",
      "USER_SEX",
      "USER_AVATAR",
      "USER_SUSPENDED",
      "_id",
    ]);
    if(!user){
      return resJson(res, new ResultObject(ResultCode.USER_NOT_FOUND));
    }
    return resJson(res, new ResultObject(ResultCode.SUCCESS,user));
  } catch (ex) {
    next(ex);
  }
};


export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    const { USER_SUSPENDED } = req.body;
    const user = await User.findOneAndUpdate({ _id},USER_SUSPENDED,{
      new: true,
      runValidators: true,
    }).select([
      "USER_EMAIL",
      "USER_SUSPENDED",
      "_id",
    ]);
    if(!user){
      return resJson(res, new ResultObject(ResultCode.USER_NOT_FOUND));
    }
    return resJson(res, new ResultObject(ResultCode.SUCCESS,user));
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject, tag?: string) => {
  customLog(tag ? tag : "", JSON.stringify(result));
  return res.send(result);
};
