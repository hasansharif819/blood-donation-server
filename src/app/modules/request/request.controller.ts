import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { requestServices } from "./request.service";
import catchAsync from "../../../shared/catchAsync";

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await requestServices.createRequest(user, req.body);
  sendResponse(res, {
    success: true,
    // statusCode: httpStatus.OK,
    statusCode: 201,
    message: "Request successfully made",
    data: result,
  });
});

const myDonationRequests = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await requestServices.myDonationRequests(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Donation requests retrieved successfully",
    data: result,
  });
});

//Donation requests made by me
const donationRequestsMadeByMe = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const result = await requestServices.donationRequestsMadeByMe(user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Donation requests thats made by me are retrieved successfully",
      data: result,
    });
  }
);

const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await requestServices.updateRequest(id, user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation request status successfully updated",
    data: result,
  });
});

//Update My Request
const updateMyRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await requestServices.updateMyRequestForBlood(
    id,
    user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully updated my donation request",
    data: result,
  });
});

export const requestController = {
  createRequest,
  myDonationRequests,
  updateRequest,
  donationRequestsMadeByMe,
  updateMyRequest,
};
