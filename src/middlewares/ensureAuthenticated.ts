import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import auth from "../config/auth";

import AppError from "../errors/AppError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing.", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, auth.jwt.secret);

    console.log(decoded);

    const { sub } = decoded as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError("invalid JWT token", 401);
  }
}
