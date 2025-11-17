import jwt, { type Jwt, type JwtPayload } from "jsonwebtoken";
import type {
  TokenPayload,
  CustomJwtPayload,
  Param,
  TokenParam,
  TokenResult,
} from "../types/helpers/user.ts";

export const generateToken = (param: Param): string => {
  const { isRefreshToken, payload } = param;
  const secret = isRefreshToken
    ? (process.env.REFRESH_TOKEN_SECRET as string)
    : (process.env.ACCESS_TOKEN_SECRET as string);
  const options = {
    expiresIn: isRefreshToken
      ? (process.env.REFRESH_TOKEN_EXPIRY as string)
      : (process.env.ACCESS_TOKEN_EXPIRY as string),
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export const verifyToken = (param: TokenParam): TokenResult => {
  try {
    const { isRefreshToken, token } = param;
    const secret = isRefreshToken
      ? (process.env.REFRESH_TOKEN_SECRET as string)
      : (process.env.ACCESS_TOKEN_SECRET as string);

    const verifiedToken = jwt.verify(token, secret) as CustomJwtPayload;
    const result: TokenResult = {
      isVerified: true,
      verifiedToken,
    };
    return result;
  } catch {
    const result: TokenResult = {
      isVerified: true,
      verifiedToken: null,
    };
    return result;
  }
};
