import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { TokenObj } from "../middlewares/authMiddleware";


export function getTokenId(req: Request, res: Response ): string | null {
    const token: string = req.cookies.jwt;
    if(token){
      const decoded = verify(token, process.env.SECRET!);
      const tokenObj = decoded as TokenObj;
      return tokenObj._id;
    }
    return null;
  }