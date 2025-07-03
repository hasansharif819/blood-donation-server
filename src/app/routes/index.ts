import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { requestRoutes } from "../modules/request/request.routes";
import { postRoutes } from "../modules/post/post.routes";
import { profileRoutes } from "../modules/profile/profile.routes";
import { postApprovalRoutes } from "../modules/postApproval/postApproval.routes";
import { commentRoutes } from "../modules/comment/comment.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/requests",
    route: requestRoutes,
  },
  {
    path: "/posts",
    route: postRoutes,
  },
  {
    path: "/profile",
    route: profileRoutes,
  },
  {
    path: "/post-approvals",
    route: postApprovalRoutes,
  },
  {
    path: "/comments",
    route: commentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
