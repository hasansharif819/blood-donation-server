import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { postApprovalValidation } from "./postApproval.validation";
import { postApprovalController } from "./postApproval.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  validateRequest(postApprovalValidation.createPostApprovalValidationSchema),
  postApprovalController.createPostApproval
);

//Get all PostApprovals
router.get(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postApprovalController.getAllPostsApproval
);

//Get all PostApprovals By Post ID
router.get(
  "/post-id/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  postApprovalController.getAllPostsApproval
);

//PostApprovals Approved By Me
router.get(
  "/me",
  auth(UserRole.USER, UserRole.ADMIN),
  postApprovalController.getPostApprovalsApprovedByMe
);

//Delete my Post Approval
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  postApprovalController.deleteMyPostApproval
);

export const postApprovalRoutes = router;
