import express from "express";
import { profileController } from "./profile.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "../user/user.validation";

const router = express.Router();

router.get(
  "/my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  profileController.myProfile
);

router.put(
  "/my-profile",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(userValidation.updateUser),
  profileController.updateProfile
);
export const profileRoutes = router;
