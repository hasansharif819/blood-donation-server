import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { notificationValidation } from "./notification.validation";
import { notificationController } from "./notification.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(notificationValidation.createNotificationValidationSchema),
  notificationController.createNotification
);

router.get(
  "/:userId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  notificationController.getNotificationByUserId
);

router.patch(
  "/:notificationId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  notificationController.updateNotificationReadStatus
);

export const notificationRoutes = router;
