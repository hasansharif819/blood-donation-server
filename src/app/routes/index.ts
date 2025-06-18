import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { requestRoutes } from "../modules/request/request.routes";
import { postRoutes } from "../modules/post/post.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
      path: '/users',
      route: userRoutes
  },
  {
    path: "/requests",
    route: requestRoutes,
  },
  {
    path: "/posts",
    route: postRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
