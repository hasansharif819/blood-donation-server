import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/", userController.getAllFromDB);
router.get("/:id", userController.getByIdFromDB);

//Delete User
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  userController.deleteUserController
);

//Partially updating user by admin
router.patch(
  "/admin/:id",
  auth(UserRole.ADMIN),
  validateRequest(userValidation.updateUserByAdmin),
  userController.updateUserByAdmin
);

export const userRoutes = router;
