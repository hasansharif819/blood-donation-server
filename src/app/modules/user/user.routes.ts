import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/donor-list", userController.getAllFromDB);
router.get("/donor-list/:id", userController.getByIdFromDB);

router.post(
  "/register",
  validateRequest(userValidation.createUser),
  userController.createUser
);

router.post(
  "/update-profile-picture",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  userController.updateUserProfilePicture
);

export const userRoutes = router;
