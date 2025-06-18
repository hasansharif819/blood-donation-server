import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { postServices } from "./post.service";
import catchAsync from "../../../shared/catchAsync";
import { postValidation } from "./post.validation";

// Create a new blood donation post
const createPost = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await postServices.createPost(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Blood donation post created successfully",
    data: result,
  });
});

// Retrieve posts where the user is a donor (approved posts)
const myDonationPosts = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await postServices.myDonationPosts(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My donation posts retrieved successfully",
    data: result,
  });
});

// Retrieve posts created by the user
const postsMadeByMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await postServices.postsMadeByMe(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts created by me retrieved successfully",
    data: result,
  });
});

// Update post status (e.g., PENDING to APPROVED)
const updatePostStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  // Validate request body using Zod
  const validatedData = postValidation.updatePostStatus.parse(req.body);
  const result = await postServices.updatePostStatus(id, user, validatedData.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post status updated successfully",
    data: result,
  });
});

// Update details of a post created by the user
const updateMyPost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  // Validate request body using Zod
  const validatedData = postValidation.updateMyBloodPost.parse(req.body);
  const result = await postServices.updateMyPost(id, user, validatedData.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My post updated successfully",
    data: result,
  });
});

// Delete a post created by the user
const deleteMyPost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await postServices.deleteMyPost(id, user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My post deleted successfully",
    data: result,
  });
});

export const postController = {
  createPost,
  myDonationPosts,
  postsMadeByMe,
  updatePostStatus,
  updateMyPost,
  deleteMyPost,
};