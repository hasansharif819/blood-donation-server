import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
// import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { userRoutes } from "./app/modules/user/user.routes";
import { AuthRoutes } from "./app/modules/Auth/auth.routes";
import { requestRoutes } from "./app/modules/request/request.routes";
import { profileRoutes } from "./app/modules/profile/profile.routes";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Blood Donation server..",
  });
});

// app.use("/api", router);
app.use("/api", userRoutes);
app.use("/api", AuthRoutes);
app.use("/api", requestRoutes);
app.use("/api", profileRoutes);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
