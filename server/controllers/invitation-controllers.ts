import { Request, Response, NextFunction } from "express";

import { ResultObject, ResultCode } from "../result-creator";
import { Invitation, User } from "../models/";
import { getTokenId } from "../utils/auth-util";

export const sendInvite = async (req: Request, res: Response, next: NextFunction) => {
  //傳送對象ID
  const { receiverId } = req.body;
  try {
    const tokenId: string | null = getTokenId(req,res);
    if (tokenId && receiverId) {
      Invitation.create({
        SENDER: tokenId,
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
    const tokenId: string | null = getTokenId(req,res);
    const Invites = await Invitation.find({ SENDER: tokenId });
    return resJson(res, new ResultObject(ResultCode.SUCCESS, Invites));
  } catch (ex) {
    next(ex);
  }
};

export const getSelfReceivedInvities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId: string | null = getTokenId(req,res);
    const Invites = await Invitation.find({ RECEIVER: tokenId });
    return resJson(res, new ResultObject(ResultCode.SUCCESS, Invites));
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject, tag?: string) => {
  customLog(tag ? tag : "", JSON.stringify(result));
  return res.send(result);
};
