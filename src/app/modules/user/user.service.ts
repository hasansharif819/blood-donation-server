import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User, UserStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import {
  IUserFilterRequest,
  SafeUser,
  SafeUserData,
  UserRaw,
} from "./user.interface";
import { userSearchableFields } from "./user.constant";
import { parseGender } from "../../../helpars/genderParse";

const getAllFromDB = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SafeUser[]>> => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterFields } = filters;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const stringFields = ["city", "location"];
  const booleanFields = ["availability"];
  const enumFields = ["role", "bloodType", "status"];

  if (Object.keys(filterFields).length > 0) {
    Object.entries(filterFields).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        if (stringFields.includes(key)) {
          andConditions.push({
            [key]: {
              contains: String(value),
              mode: "insensitive",
            },
          });
        } else if (booleanFields.includes(key)) {
          andConditions.push({
            [key]: {
              equals: value === "true",
            },
          });
        } else if (key === "name") {
          andConditions.push({
            [key]: {
              contains: String(value),
              mode: "insensitive",
            },
          });
        } else if (key === "gender") {
          const genderEnum = parseGender(value);
          if (genderEnum) {
            andConditions.push({
              userProfile: {
                gender: {
                  equals: genderEnum,
                },
              },
            });
          }
        } else if (enumFields.includes(key)) {
          andConditions.push({
            [key]: {
              equals: value,
            },
          });
        } else {
          andConditions.push({
            [key]: {
              equals: value,
            },
          });
        }
      }
    });
  }

  andConditions.push({
    status: UserStatus.ACTIVE,
  });

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const usersRaw: UserRaw[] = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { totalDonations: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bloodType: true,
      location: true,
      city: true,
      profilePicture: true,
      totalDonations: true,
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
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const users: SafeUser[] = usersRaw.map((user) => {
    if (user.userProfile && user.userProfile.lastDonationDate) {
      const ld = user.userProfile.lastDonationDate;
      return {
        ...user,
        userProfile: {
          ...user.userProfile,
          // lastDonationDate: typeof ld === "string" ? new Date(ld) : ld,
        },
      };
    }
    return user;
  }) as SafeUser[];

  const total = await prisma.user.count({ where: whereCondition });

  return {
    meta: { total, page, limit },
    data: users,
  };
};

// Get user by ID
const getByIdFromDB = async (id: string): Promise<SafeUserData | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bloodType: true,
      location: true,
      city: true,
      profilePicture: true,
      totalDonations: true,
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
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return result;
};

const getTopDonors = async () => {
  console.log(`Fetching top donors...`);
  const result = await prisma.user.findMany({
    where: {
      status: UserStatus.ACTIVE,
      totalDonations: {
        gte: 1,
      },
    },
    orderBy: {
      totalDonations: "desc",
    },
    take: 12,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bloodType: true,
      location: true,
      city: true,
      profilePicture: true,
      totalDonations: true,
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
          gender: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return result;
};

//Delete User
const deleteUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not found");
  }

  const deletedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return deletedUser;
};

//partial updating the user BY ADMIN
const updateUserByAdmin = async (id: string, data: any) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      role: data.role,
      status: data.status,
    },
  });

  const { password, ...safeUser } = updatedUser;

  return safeUser;
};

export const userServices = {
  getAllFromDB,
  getByIdFromDB,
  getTopDonors,
  deleteUser,
  updateUserByAdmin,
};
