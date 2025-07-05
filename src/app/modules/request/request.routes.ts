import express from "express";
import { requestController } from "./request.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { requestValidation } from "./request.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(requestValidation.createRequest),
  requestController.createRequest
);

router.get("/", auth(UserRole.USER), requestController.myDonationRequests);

//Donation Requests Made By Me
router.get(
  "/request-made-by-me",
  auth(UserRole.USER, UserRole.ADMIN),
  requestController.donationRequestsMadeByMe
);

router.patch(
  "/update-status/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  requestController.updateRequest
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(requestValidation.updateMyBloodRequest),
  requestController.updateMyRequest
);

//Delete my Blood Request
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  requestController.deleteMyRequest
);

export const requestRoutes = router;
