import httpStatus from "http-status";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { conversationService } from "./conversation.service";
import catchAsync from "../../../shared/catchAsync";

const createConversation = catchAsync(async (req: Request, res: Response) => {
  const result = await conversationService.createConversation(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Conversations created successfully",
    data: result,
  });
});

const getConversationsByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await conversationService.getConversationsByUserId(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Conversations fetched successfully",
      data: result,
    });
  }
);

const getConversationById = catchAsync(async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  const result = await conversationService.getConversationById(conversationId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Conversation fetched successfully",
    data: result,
  });
});

export const conversationController = {
  createConversation,
  getConversationsByUserId,
  getConversationById,
};
