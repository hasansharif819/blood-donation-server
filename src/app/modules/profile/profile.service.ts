import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

//My Profile
const myProfile = async (user: any) => {
  const userEmail = user.email;
  const getMe = await prisma.user.findUnique({
    where: {
      email: userEmail,
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
      userProfile: true,
    },
  });
  return getMe;
};

//Update My Profile
const updateProfile = async (user: any, data: any) => {
  const userEmail = user.email;

  const profile = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  if (!profile) {
    return httpStatus.NOT_FOUND;
  }

  const meId = profile.id;

  const updateMe = await prisma.userProfile.update({
    where: {
      userId: meId,
    },
    data,
  });
  return updateMe;
};

export const profileServices = {
  myProfile,
  updateProfile,
};
