
import bcrypt from "bcryptjs";
import prisma from "../db/prisma.ts";
import ApiError from "../utils/apiError.ts";
import asyncHandlerFunction from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { generateToken, verifyToken } from "../helpers/user.ts";
import type { CookieOptions } from "express";
import type {
  LoginPayload,
  RegisterPayload,
} from "../types/controllers/user.ts";

export const register = asyncHandlerFunction(async (req, res) => {
  const payload: RegisterPayload = req.body;

  const { email, fullName, password } = payload;

  if (!email || !fullName || !password) {
    throw new ApiError("Required fields are missing", 401);
  }

  const isAlreadyUser = await prisma.user.findFirst({
    where: { email },
  });

  if (isAlreadyUser) {
    throw new ApiError("Already user", 401);
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: encryptedPassword,
    },
  });

  res
    .status(201)
    .json(new ApiResponse("User registered successfully", 200, {}, true));
});

export const login = asyncHandlerFunction(async (req, res) => {
  const payload: LoginPayload = req.body;

  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError("Required fields are missing", 401);
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new ApiError("User not registered", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect password", 401);
  }

  // generate tokens

  const accessToken = generateToken({
    isRefreshToken: false,
    payload: {
      id: user.id,
    },
  });
  const refreshToken = generateToken({
    isRefreshToken: true,
    payload: {
      id: user.id,
    },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), 
      userId: user.id,
    },
  });
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    // secure:true
  };

  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        "User logged in successfully",
        200,
        { accessToken, refreshToken },
        true
      )
    );
});

export const logout = asyncHandlerFunction(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    // secure:true
  };

  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse("User logged out successfully", 200, {}, true));
});

export const profile = asyncHandlerFunction(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError("User not found", 401);
  }

  const { ...userData, password } = user;
  return res
    .status(200)
    .json(
      new ApiResponse(
        "User profile fetched successfully",
        200,
        { userData },
        true
      )
    );
});

export const refreshToken = asyncHandlerFunction(async (req, res) => {
  const userId = req.user.id;

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError("Refresh token not found", 401);
  }

  // verify token

  const { isVerified, verifiedToken } = verifyToken({
    isRefreshToken: true,
    token: refreshToken,
  });

  if (!isVerified || !verifiedToken) {
    throw new ApiError("Invalid or expired token", 403);
  }
  const storedToken = await prisma.refreshToken.findFirst({
    where: { token: refreshToken },
  });
  if (!storedToken) {
    throw new ApiError("Token doesn't exist or is already rotated", 403);
  }
  await prisma.refreshToken.delete({
    where: { id: storedToken.id },
  });
  // generate new accesstoken
  // generate new refreshToken
  const newAccessToken = generateToken({
    isRefreshToken: false,
    payload: { id: verifiedToken.id },
  });

  const newRefreshToken = generateToken({
    isRefreshToken: true,
    payload: { id: verifiedToken.id },
  });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      userId: verifiedToken.id,
    },
  });

  const cookieOptions: CookieOptions = { httpOnly: true };

  res
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        "Token refreshed successfully",
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        true
      )
    );
});
