import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { postApprovalServices } from "./postApproval.service";

// Create post approval
const createPostApproval = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await postApprovalServices.createPostApproval(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post approval created successfully",
    data: result,
  });
});

//Retrieve All posts Approval
const getAllPostsApproval = catchAsync(async (req: Request, res: Response) => {
  const { page = "1", limit = "50", ...filters } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  const result = await postApprovalServices.getAllPostsApproval(filters, {
    page: pageNumber,
    limit: limitNumber,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts approval retrieved successfully",
    data: result,
    meta: result.meta,
  });
});

//Retrieve posts Approval approved by Post ID
const getPostsApprovalByPostID = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.BAD_REQUEST,
        message: "Post ID is required and must be a string",
        data: null,
      });
    }

    const result = await postApprovalServices.getAllPostsApprovalsByPostID(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post approval By Post ID retrieved successfully",
      data: result,
    });
  }
);

// Retrieve posts Approval approved by the user
const getPostApprovalsApprovedByMe = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    // Parse query parameters or use default
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await postApprovalServices.getPostsApprovalsApprovedByMe(
      user,
      page,
      limit
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Approvals Approved by me retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// Delete a post created by the user
const deleteMyPostApproval = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await postApprovalServices.deleteMyPostApproval(id, user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My post deleted successfully",
    data: result,
  });
});

export const postApprovalController = {
  createPostApproval,
  getAllPostsApproval,
  getPostsApprovalByPostID,
  getPostApprovalsApprovedByMe,
  deleteMyPostApproval,
};
