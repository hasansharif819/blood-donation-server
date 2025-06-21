import express from "express";
import { profileController } from "./profile.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "../user/user.validation";

const router = express.Router();

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  profileController.myProfile
);

router.patch(
  "/update-my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(userValidation.updateUser),
  profileController.updateProfile
);

router.post(
  "/update-profile-picture",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  profileController.updateUserProfilePicture
);

export const profileRoutes = router;
