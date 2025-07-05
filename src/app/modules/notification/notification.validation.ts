import { z } from "zod";
import { ENUM_NOTIFICATION_TYPE } from "../../../enums/notification";

const createNotificationValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required!",
    }),
    type: z.nativeEnum(ENUM_NOTIFICATION_TYPE, {
      required_error: "Notification type is required!",
    }),
    message: z.string({
      required_error: "Message is required!",
    }),
    actorId: z.string().optional(),
    postId: z.string().optional(),
    requestId: z.string().optional(),
    commentId: z.string().optional(),
  }),
});

export const notificationValidation = {
  createNotificationValidationSchema,
};
