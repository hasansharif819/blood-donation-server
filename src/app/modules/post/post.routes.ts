import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { postValidation } from "./post.validation";
import { postController } from "./post.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(postValidation.createPostValidationSchema),
  postController.createPost
);

router.get(
  "/",
  // auth(UserRole.USER),
  postController.getAllPosts
);

//Post Made By Me
router.get(
  "/post-made-by-me",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.postsMadeByMe
);

router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  postController.updatePostStatus
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(postValidation.updatePostStatus),
  postController.updateMyPost
);

//Delete my Blood Post
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.deleteMyPost
);

export const postRoutes = router;
