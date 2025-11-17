import prisma from "../db/prisma.ts";
import { verifyToken } from "../helpers/user.ts";
import ApiError from "../utils/apiError.ts";
import asyncHandlerFunction from "../utils/asyncHandler.ts";


const verifyAuth = asyncHandlerFunction(async(req,res,next)=>{
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if(!accessToken){
        throw new ApiError("Token not found",401);
    }

    const {isVerified,verifiedToken} = verifyToken({isRefreshToken:false,token:accessToken});

    if(!isVerified ||!verifiedToken){
        throw new ApiError("TokenExpired",403)
    }

    const user = await prisma.user.findFirst({
        where:{
            id:verifiedToken?.id
        }
    })

    req.user= user;
    next();
})

export default verifyAuth;