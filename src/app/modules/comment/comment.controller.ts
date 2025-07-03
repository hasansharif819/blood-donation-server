import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { commentService } from "./comment.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await commentService.createComment(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: result,
  });
});

const getCommentsByPostId = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const result = await commentService.getCommentsByPostId(postId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const getReplyByParentId = catchAsync(async (req: Request, res: Response) => {
  const { parentId } = req.params;
  const result = await commentService.getReplyByParentId(parentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Replies retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { commentId } = req.params;
  const result = await commentService.updateComment(
    user.userId,
    commentId,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { commentId } = req.params;
  const result = await commentService.deleteComment(user.userId, commentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  getCommentsByPostId,
  getReplyByParentId,
  updateComment,
  deleteComment,
};
