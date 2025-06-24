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

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const { page = "1", limit = "50", ...filters } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  const result = await postServices.getAllPosts(filters, {
    page: pageNumber,
    limit: limitNumber,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation posts retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Retrieve posts created by the user
const postsMadeByMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  // Parse query parameters or use default
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  const result = await postServices.postsMadeByMe(user, page, limit);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts created by me retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// Update post status (e.g., PENDING to APPROVED)
const updatePostStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const validatedData = postValidation.updatePostStatus.parse(req.body);
  const result = await postServices.updatePostStatus(
    id,
    user,
    validatedData.body
  );

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
  getAllPosts,
  postsMadeByMe,
  updatePostStatus,
  updateMyPost,
  deleteMyPost,
};
