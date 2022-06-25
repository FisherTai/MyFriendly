import { Request, Response, NextFunction } from "express";
import { ResultObject, ResultCode } from "../result-creator";
import Invitation from "../models/invitation-model";
import { verify } from "jsonwebtoken";

interface TokenObj {
  _id: string;
}

export const sendInvite = async (req: Request, res: Response, next: NextFunction) => {
  //傳送對象ID
  const { receiverId } = req.params;
  try {
    const token: string = req.cookies.jwt;
    if (token) {
      const decoded = verify(token, process.env.SECRET!);
      const tokenObj = decoded as TokenObj;
      Invitation.create({
        SENDER: tokenObj._id,
        RECEIVER: receiverId,
      });
      return resJson(res, new ResultObject(ResultCode.SUCCESS));
    }
    return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
  } catch (err) {
    next(err);
  }
};

export const setInviteState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    const { STATE } = req.body;
    if (!_id || !STATE) {
      return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
    }
    await Invitation.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    }).orFail();
    return resJson(res, new ResultObject(ResultCode.SUCCESS));
  } catch (ex) {
    next(ex);
  }
};

export const getSelfSendedInvities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.cookies.jwt;
    if (token) {
      const decoded = verify(token, process.env.SECRET!);
      const tokenObj = decoded as TokenObj;
      const Invites = await Invitation.find({ SENDER: tokenObj._id });
      return resJson(res, new ResultObject(ResultCode.SUCCESS, Invites));
    }
    return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
  } catch (ex) {
    next(ex);
  }
};

export const getSelfReceivedInvities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.cookies.jwt;
    if (token) {
      const decoded = verify(token, process.env.SECRET!);
      const tokenObj = decoded as TokenObj;
      const Invites = await Invitation.find({ RECEIVER: tokenObj._id });
      return resJson(res, new ResultObject(ResultCode.SUCCESS, Invites));
    }
    return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject, tag?: string) => {
  customLog(tag ? tag : "", JSON.stringify(result));
  return res.send(result);
};
