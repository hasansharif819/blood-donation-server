import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { userFilterableFields } from "./user.constant";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donors successfully found",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donor retrieval successfully",
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);
  sendResponse(res, {
    // statusCode: httpStatus.OK,
    success: true,
    statusCode: 201,
    message: "User registered successfuly!",
    data: result,
  });
});

//Delete user
const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log("Params = ", id);
  const result = await userServices.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You have successfully deleted the user",
    data: result,
  });
});

//Partially updating user by admin
const updateUserByAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.updateUserByAdmin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You have successfully updated the user",
    data: result,
  });
});

export const userController = {
  getAllFromDB,
  getByIdFromDB,
  createUser,
  deleteUserController,
  updateUserByAdmin,
};
