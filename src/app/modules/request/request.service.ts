import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { RequestStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";

const createRequest = async (user: any, data: any) => {
  // console.log("Request for User = ", user);

  const userEmail = user.email;
  const requester = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  //Here I add throw new ApiError () instead of return

  if (!requester) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // console.log("requester", requester);

  const donorId = data.donorId;
  const requesterId = requester.id;
  const existingDonor = await prisma.user.findUnique({
    where: {
      id: donorId,
    },
  });

  if (!existingDonor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donor not found");
  }

  if (existingDonor.status !== "ACTIVE") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Donor is inactive");
  }

  if (existingDonor.bloodType !== data.bloodType) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Donor is not of the same blood type"
    );
  }

  // console.log("existingDonor", existingDonor);

  const requestData = {
    donorId: data.donorId,
    requesterId,
    bloodType: data.bloodType,
    phoneNumber: data.phoneNumber,
    dateOfDonation: data.dateOfDonation,
    hospitalName: data.hospitalName,
    hospitalAddress: data.hospitalAddress,
    reason: data.reason,
  };

  // console.log("Request Data = ", requestData);

  const result = await prisma.request.create({
    data: requestData,
    include: {
      donor: {
        select: {
          id: true,
          name: true,
          email: true,
          bloodType: true,
          location: true,
          availability: true,
          createdAt: true,
          updatedAt: true,
          userProfile: {
            select: {
              id: true,
              userId: true,
              bio: true,
              age: true,
              lastDonationDate: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  // console.log("result", result);

  return result;
};

const myDonationRequests = async (user: any) => {
  // const userEmail = user.email;
  const loggedInUserId = user.userId;
  const userId = await prisma.user.findUnique({
    where: {
      id: loggedInUserId,
    },
  });

  if (!userId) {
    return httpStatus.NOT_FOUND, "User not found";
  }

  const donorId = userId.id;

  const result = await prisma.request.findMany({
    where: {
      donorId,
    },
  });

  // Fetch requester information for each request
  const requestsWithRequester = await Promise.all(
    result.map(async (request) => {
      if (!request.requesterId) {
        return {
          ...request,
          requester: null,
        };
      }
      const requester = await prisma.user.findUnique({
        where: {
          id: request.requesterId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      });

      return {
        ...request,
        requester: requester || null,
      };
    })
  );

  // console.log("Result = ", requestsWithRequester);
  return requestsWithRequester;
};

//Donation Request made by me
const donationRequestsMadeByMe = async (user: any) => {
  const loggedInUserId = user.userId;
  const requestUser = await prisma.user.findUnique({
    where: {
      id: loggedInUserId,
    },
  });

  if (!requestUser) {
    return httpStatus.NOT_FOUND, "User not found";
  }

  const requesterId = requestUser.id;

  const result = await prisma.request.findMany({
    where: {
      requesterId,
    },
  });

  // console.log("My Requests = ", result);

  // Fetch Donor information for each request
  const myRequestsForDonor = await Promise.all(
    result.map(async (request) => {
      if (!request.donorId) {
        return {
          ...request,
          donor: null,
        };
      }
      const bloodDonor = await prisma.user.findUnique({
        where: {
          id: request.donorId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          location: true,
          bloodType: true,
          availability: true,
        },
      });

      return {
        ...request,
        donor: bloodDonor || null,
      };
    })
  );

  // console.log("myRequestsForDonor = ", myRequestsForDonor);
  return myRequestsForDonor;
};

const updateRequest = async (
  id: string,
  user: any,
  statusObject: { status: RequestStatus }
) => {
  const { status } = statusObject;

  const requestedData = await prisma.request.findUnique({
    where: {
      id,
    },
  });

  if (!requestedData) {
    return httpStatus.NOT_FOUND, "Provided request Id is not found";
  }

  const donorEmail = user.email;

  const donorData = await prisma.user.findUnique({
    where: {
      email: donorEmail,
    },
  });

  if (!donorData) {
    return httpStatus.UNAUTHORIZED, "unauthorized error";
  }

  const donorId = donorData.id;

  if (donorId !== requestedData.donorId) {
    return httpStatus.UNAUTHORIZED, "unauthorized error";
  }

  const updateRequestStatus = await prisma.request.update({
    where: {
      id,
    },
    data: {
      requestStatus: status,
    },
  });

  return updateRequestStatus;
};

//Update my Requests
const updateMyRequestForBlood = async (id: string, user: any, payload: any) => {
  const loggedInUserId = user.userId;

  const requestedData = await prisma.request.findUnique({
    where: {
      id,
    },
  });

  if (!requestedData) {
    return httpStatus.NOT_FOUND, "Provided request Id is not found";
  }

  if (loggedInUserId !== requestedData.requesterId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not unauthorized to update"
    );
  }

  let donorId = payload.donorId;
  console.log("Donor Id = ", donorId);
  if (!payload.donorId) {
    donorId = requestedData.donorId;
  }

  // const donorId = data.donorId;
  const existingDonor = await prisma.user.findUnique({
    where: {
      id: donorId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      bloodType: true,
      location: true,
      city: true,
      profilePicture: true,
      totalDonations: true,
      availability: true,
      status: true,
      userProfile: true,
    },
  });

  if (!existingDonor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donor not found");
  }

  if (existingDonor.status !== "ACTIVE") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Donor is inactive");
  }

  let bloodType = payload.bloodType;
  if (!bloodType) {
    bloodType = requestedData.bloodType;
  }

  if (existingDonor.bloodType !== bloodType) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Donor is not of the same blood type"
    );
  }

  const updatedPayload = {
    ...payload,
    requestStatus: "PENDING",
  };

  const updateRequestForBlood = await prisma.request.update({
    where: {
      id,
    },
    data: updatedPayload,
  });

  return { ...updateRequestForBlood, donor: existingDonor };
};

export const requestServices = {
  createRequest,
  myDonationRequests,
  updateRequest,
  donationRequestsMadeByMe,
  updateMyRequestForBlood,
};
