import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { commentValidation } from "./comment.validation";
import { commentController } from "./comment.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(commentValidation.createCommentValidationSchema),
  commentController.createComment
);

router.get(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  commentController.getCommentsByPostId
);

router.get(
  "/reply/:parentId",
  auth(UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  commentController.getReplyByParentId
);

router.patch(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(commentValidation.updateCommentValidationSchema),
  commentController.updateComment
);

router.delete(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  commentController.deleteComment
);

export const commentRoutes = router;
