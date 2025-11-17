import type { JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
}
export interface CustomJwtPayload extends JwtPayload {
  id: string;
}
export interface Param {
  isRefreshToken: boolean;
  payload: TokenPayload;
}
export interface TokenParam {
    isRefreshToken: boolean;
    token:string;
}
export interface TokenResult{
    isVerified:boolean,
    verifiedToken:CustomJwtPayload|null
}