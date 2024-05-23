import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User, UserStatus } from "@prisma/client";
import { userSearchAbleFields } from "./user.constant";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

//Get all users
const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
      bloodType: true,
      location: true,
      availability: true,
      status: true,
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
  });

  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//get by id
const getByIdFromDB = async (id: string): Promise<User | null> => {
  // console.log(id);
  const result = await prisma.user.findUnique({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
    include: {
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
  });
  // console.log(result);
  return result;
};

//Create user
const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // console.log(data);

  const userData = {
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "USER",
    bloodType: data.bloodType,
    location: data.location,
    availability: data.availability,
    status: data.status,
  };

  const userInfo = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });
  // console.log(userInfo);

  if (userInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const result = prisma.$transaction(async (transactionClient) => {
    const createdUser = await transactionClient.user.create({
      data: userData,
    });

    const createdUserProfile = await transactionClient.userProfile.create({
      data: {
        userId: createdUser.id,
        age: data.age,
        bio: data.bio,
        lastDonationDate: data.lastDonationDate,
      },
    });
    // return createdUserProfile;
    // Fetch user details to include in the response
    const userDetails = await transactionClient.user.findUnique({
      where: {
        id: createdUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bloodType: true,
        location: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { ...userDetails, userProfile: createdUserProfile };
  });

  return result;
};

export const userServices = {
  getAllFromDB,
  getByIdFromDB,
  createUser,
};
