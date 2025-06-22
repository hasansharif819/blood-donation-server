import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import './cron/updateAvailability';

const app: Application = express();

app.use(
  cors({
    origin: [
      "https://blood-donation-app-kohl.vercel.app",
      "http://localhost:3000",
    ],
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
    Message: "Blood Donation App Server is Running...",
  });
});

app.use("/api", router);

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
