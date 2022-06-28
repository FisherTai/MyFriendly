import { User } from "../models";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getTokenId } from "../utils/auth-util";
import { ResultObject, ResultCode } from "../result-creator";

export interface TokenObj {
  _id: string;
}

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenId = getTokenId(req, res);
    if (tokenId) {
      const user = await User.findById(tokenId);
      if (user) {
        customLog("checkUser", "驗證成功");
        next();
      } else {
        res.status(401).send(new ResultObject(ResultCode.PARAM_ERROR));
      }
    } else {
      res.status(401).send(new ResultObject(ResultCode.USER_NOT_LOGIN));
    }
  } catch (err) {
    res.status(401).send(new ResultObject(ResultCode.PARAM_ERROR));
  }
};
