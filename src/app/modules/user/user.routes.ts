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

//Delete User
router.put(
  "/donors/:id",
  auth(UserRole.ADMIN),
  userController.deleteUserController
);

export const userRoutes = router;
