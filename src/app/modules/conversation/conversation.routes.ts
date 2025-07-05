import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
// import validateRequest from "../../middlewares/validateRequest";
import { conversationController } from "./conversation.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  //   validateRequest(commentValidation.createCommentValidationSchema),
  conversationController.createConversation
);

router.get(
  "/:userId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  conversationController.getConversationsByUserId
);
router.get(
  "/conversation/:conversationId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  conversationController.getConversationById
);

export const conversationRoutes = router;
