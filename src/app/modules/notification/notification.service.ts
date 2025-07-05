import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";

const createNotification = async (user: any, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const notification = await prisma.notification.create({
    data: {
      userId: user.userId,
      postId: payload.postId,
      type: payload.type,
      message: payload.message,
      actorId: payload.actorId,
      requestId: payload.requestId,
      commentId: payload.commentId,
    },
  });

  return notification;
};

const getNotificationsByUserId = async (
  userId: string,
  page: number,
  limit: number,
  isRead?: boolean
) => {
  const skip = (page - 1) * limit;

  const whereClause: any = {
    userId,
  };

  if (typeof isRead === "boolean") {
    whereClause.isRead = isRead;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
        ...whereClause,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    }),
    prisma.notification.count({
      where: {
        userId,
        ...whereClause,
      },
    }),
  ]);

  return {
    data: notifications,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateNotificationReadStatus = async (notificationId: string) => {
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }
  return notification;
};

export const notificationService = {
  createNotification,
  getNotificationsByUserId,
  updateNotificationReadStatus,
};
