import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import { IChangePassword } from "./auth.interface";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { AuthUtils } from "./auth.utils";
import { hashedPassword } from "../../../helpers/hashedPasswordHelper";
import emailSender from "./emailSender";

//Create user
const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  return await prisma.$transaction(async (tx) => {
    // Step 1: Create user
    const createdUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
        bloodType: data.bloodType,
        location: data.location,
        city: data.city,
        totalDonations: data.totalDonations ?? 0,
        availability: data.availability ?? true,
        status: data.status ?? 'ACTIVE',
      },
    });

    // Step 2: Create user profile
    const createdUserProfile = await tx.userProfile.create({
      data: {
        userId: createdUser.id,
        age: data.age,
        bio: data.bio,
        gender: data.gender,
        contactNumber: data.contactNumber ?? '',
        lastDonationDate: data.lastDonationDate,
      },
    });

    // Step 3: Select and return combined result
    const userDetails = await tx.user.findUnique({
      where: { id: createdUser.id },
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
};

const loginUser = async (payload: { email: string; password: string }) => {
  // console.log("User login...", payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
    userData,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  // console.log(payload);
  // console.log(user);

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.userId,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // checking old password
  if (
    isUserExist.password &&
    !(await AuthUtils.comparePasswords(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old Password is incorrect");
  }

  const hashPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // console.log("Forgot password...", userData);

  const resetPassToken = jwtHelpers.generateToken(
    { userId: userData.id, email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  // console.log("Reset Password Link = ", resetPassToken);

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
      <div>
          <h5>Hello Dear ${userData.name}</h5>
          <a href=${resetPassLink}>Your reset password link is here. 
          Please click the link to reset your password.This link is valid for 5 minutes.
          </a>
          <p>Please do not share this link with others. Stay with us.</p>
          <h5>Donate Blood Save Life</h5>
          <h5>Thank you</h5>
          <h5>Best Regards</h5>
          <h5>Blood Donation App</h5>
      </div>
      `
  );
  // console.log("Reset pass link = ", resetPassLink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  // console.log({ token, payload });

  const userData = await prisma.user.findMany({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  const result = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
  // console.log("result = ", result);
  return result;
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
};
