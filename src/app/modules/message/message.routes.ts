import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { messageController } from "./message.controller";

const router = express.Router();

router.get(
  "/:conversationId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  messageController.getMessagesByConversationId
);

export const messagesRoutes = router;
