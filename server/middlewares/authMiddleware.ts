import User from "../models/user-model";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenObj {
  _id: string;
}

export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.cookies.jwt;
    console.log(token);
    if (token) {
      const decoded = verify(token, process.env.SECRET!);
      const tokenObj = decoded as TokenObj;
      const user = await User.findById(tokenObj._id);
      if (user) {
        customLog("checkUser", "驗證成功");
        next();
      } else {
        res.status(401).send({ status: false });
      }
    } else {
      res.status(401).send({ status: false });
    }
  } catch (err) {
    res.status(401).send({ status: false });
  }
};
