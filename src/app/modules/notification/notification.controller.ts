import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { notificationService } from "./notification.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await notificationService.createNotification(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Notification created successfully",
    data: result,
  });
});

const getNotificationByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const isRead =
      req.query.isRead === "true"
        ? true
        : req.query.isRead === "false"
        ? false
        : undefined;

    const result = await notificationService.getNotificationsByUserId(
      userId,
      page,
      limit,
      isRead
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Notifications retrieved successfully",
      data: result,
    });
  }
);

const updateNotificationReadStatus = catchAsync(
  async (req: Request, res: Response) => {
    const notificationId = req.params.notificationId;
    const result = await notificationService.updateNotificationReadStatus(
      notificationId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Notification read status updated successfully",
      data: result,
    });
  }
);

export const notificationController = {
  createNotification,
  getNotificationByUserId,
  updateNotificationReadStatus,
};
