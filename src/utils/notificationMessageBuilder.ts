import { NotificationType } from "@prisma/client";
import prisma from "../shared/prisma";
import ApiError from "../app/errors/ApiError";
import httpStatus from "http-status";

interface CreateNotificationPayload {
  type: NotificationType;
  userId: string;
  actorId: string;
  postId?: string;
  requestId?: string;
  commentId?: string;
  status?: "APPROVED" | "REJECTED";
}

export const buildNotificationMessage = ({
  type,
  actorName,
  status,
}: {
  type: NotificationType;
  actorName: string;
  status?: "APPROVED" | "REJECTED";
}): string => {
  switch (type) {
    case "NEW_COMMENT":
      return `${actorName} commented on your post.`;
    case "COMMENT_REPLY":
      return `${actorName} replied to your comment.`;
    case "POST_APPROVED":
      return `${actorName} approved your post for donation.`;
    case "REQUEST_RESPONSE":
      if (!status) return `${actorName} responded to your request.`;
      return `${actorName} ${status.toLowerCase()} your donation request.`;
    case "POST_APPROVAL_REMINDER":
      return `Reminder: You have an upcoming approved donation.`;
    default:
      return "You have a new notification.";
  }
};

export const dynamicCreateNotification = async (
  payload: CreateNotificationPayload
) => {
  const [recipient, actor] = await Promise.all([
    prisma.user.findUnique({ where: { id: payload.userId } }),
    prisma.user.findUnique({ where: { id: payload.actorId } }),
  ]);

  if (!recipient) {
    throw new ApiError(httpStatus.NOT_FOUND, "Recipient user not found");
  }

  if (!actor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Actor user not found");
  }

  const message = buildNotificationMessage({
    type: payload.type,
    actorName: actor.name,
    status: payload.status,
  });

  const notification = await prisma.notification.create({
    data: {
      userId: payload.userId,
      actorId: payload.actorId,
      type: payload.type,
      message,
      postId: payload.postId,
      requestId: payload.requestId,
      commentId: payload.commentId,
    },
  });

  return notification;
};
