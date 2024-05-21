import { Request, Response } from "express";
import { profileServices } from "./profile.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const myProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await profileServices.myProfile(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await profileServices.updateProfile(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

export const profileController = {
  myProfile,
  updateProfile,
};
