import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/donor-list", userController.getAllFromDB);
router.get("/donor-list/:id", userController.getByIdFromDB);

router.post(
  "/register",
  validateRequest(userValidation.createUser),
  userController.createUser
);

export const userRoutes = router;
