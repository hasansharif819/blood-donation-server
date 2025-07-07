import httpStatus from "http-status";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { messageService } from "./message.service";

const getMessagesByConversationId = catchAsync(
  async (req: Request, res: Response) => {
    const conversationId = req.params.conversationId;
    const result = await messageService.getMessagesByConversationId(
      conversationId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Messages are fetched successfully",
      data: result,
    });
  }
);

export const messageController = {
  getMessagesByConversationId,
};
