const Messages = require("../models/message-model");
import { IMessage } from "../models/message-model";
import { Request, Response, NextFunction } from "express";
import { ResultObject, ResultCode } from "../result-creator";

module.exports.getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to } = req.body;

    const messages: IMessage[] = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    resJson(res, new ResultObject(ResultCode.SUCCESS, projectedMessages));
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return resJson(res, new ResultObject(ResultCode.SUCCESS));
    else return resJson(res, new ResultObject(ResultCode.MESSAGE_SEND_FAIL));
  } catch (ex) {
    next(ex);
  }
};

const resJson = (res: Response, result: ResultObject) => {
  console.log(result);
  return res.send(result);
};
