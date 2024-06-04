import express from "express";
import { AuthController } from "./auth.controller";
import { ENUM_USER_ROLE } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/login", AuthController.loginUser);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AuthController.changePassword
);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
