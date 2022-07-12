import { Request, Response, NextFunction } from "express";

import { ResultObject, ResultCode } from "../result-creator";
import { Invitation, User } from "../models/";
import { IUser } from "../models/user-model";
import { getTokenId } from "../utils/auth-util";
// import { ClientSession } from "mongodb";

export const sendInvite = async (req: Request, res: Response, next: NextFunction) => {
  //傳送對象ID
  const { receiverId } = req.body;
  try {
    const tokenId: string | null = getTokenId(req, res);
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

/** TODO:預計要用到Transaction，但副本集的環境還沒處理好.... */
export const approveInvite = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;
  if (!_id) {
    return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
  }
  // const mongoSession = await User.startSession();
  // mongoSession.startTransaction();

  try {
    const invite = await Invitation.findOneAndUpdate(
      { _id },
      { STATE: 1 },
      {
        new: true,
        runValidators: true,
      }
    )
      .orFail()
      // .session(mongoSession)
      .exec();

    // 加入通訊錄
    const tokenId: string | null = getTokenId(req, res);
    await User.findOneAndUpdate({ _id: tokenId }, { $addToSet: { USER_CONCATS: invite.SENDER } })
      .orFail()
      // .session(mongoSession)
      .exec();

    await User.findOneAndUpdate({ _id: invite.SENDER }, { $addToSet: { USER_CONCATS: tokenId } })
      .orFail()
      // .session(mongoSession)
      .exec();

    // await mongoSession.commitTransaction();

    return resJson(res, new ResultObject(ResultCode.SUCCESS));
  } catch (ex) {
    // console.info(`Aborted`);
    // await mongoSession.abortTransaction();
    next(ex);
  } finally {
    // mongoSession.endSession();
  }
};

export const rejectInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return resJson(res, new ResultObject(ResultCode.PARAM_ERROR));
    }
    await Invitation.findOneAndUpdate(
      { _id },
      { STATE: 2 },
      {
        new: true,
        runValidators: true,
      }
    ).orFail();
    return resJson(res, new ResultObject(ResultCode.SUCCESS));
  } catch (ex) {
    next(ex);
  }
};

export const getSelfSendedInvities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId: string | null = getTokenId(req, res);
    const Invites = await Invitation.find({ SENDER: tokenId });
    return resJson(res, new ResultObject(ResultCode.SUCCESS, Invites));
  } catch (ex) {
    next(ex);
  }
};

export const getSelfReceivedInvities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId: string | null = getTokenId(req, res);
    const Invites = await Invitation.find({ RECEIVER: tokenId, STATE: 3 }).populate<{ SENDER: IUser }>("SENDER", "USER_NAME USER_AVATAR");
    return resJson(res, new ResultObject(ResultCode.SUCCESS, Invites));
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject, tag?: string) => {
  customLog(tag ? tag : "", JSON.stringify(result));
  return res.send(result);
};
