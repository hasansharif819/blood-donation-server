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
// const updateProfile = async (user: any, data: any) => {
//   // console.log("User = ", user);
//   // const userEmail = user.email;

//   // email: userEmail,
//   const userId = user.userId;
//   console.log("User id = ", userId);

//   const profile = await prisma.user.findFirst({
//     where: {
//       id: userId,
//     },
//   });

//   console.log("profile = ", profile);

//   if (!profile) {
//     return httpStatus.NOT_FOUND;
//   }

//   const meId = profile.id;

//   const updateMe = await prisma.userProfile.update({
//     where: {
//       userId: meId,
//     },
//     data,
//   });
//   return updateMe;
// };

//partial updating the user profile
const updateProfile = async (user: any, data: any) => {
  const userId = user.userId;

  // console.log(userId);

  // Find the user and include their profile
  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      userProfile: true,
    },
  });

  if (!profile) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found!",
    };
  }

  // Separate the user and userProfile data
  const userData = {
    name: data.name,
    email: data.email,
    password: data.password,
    needPasswordChange: data.needPasswordChange,
    role: data.role,
    bloodType: data.bloodType,
    location: data.location,
    city: data.city,
    profilePicture: data.profilePicture,
    totalDonations: data.totalDonations,
    availability: data.availability,
    status: data.status,
  };

  const userProfileData = {
    bio: data.bio,
    age: data.age,
    lastDonationDate: data.lastDonationDate,
  };

  // console.log("user data = ", userData);

  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );
  const filteredUserProfileData = Object.fromEntries(
    Object.entries(userProfileData).filter(([_, v]) => v !== undefined)
  );

  // Use a transaction to update both User and UserProfile
  const [updatedUser, updatedUserProfile] = await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: filteredUserData,
    }),
    prisma.userProfile.update({
      where: {
        userId: userId,
      },
      data: filteredUserProfileData,
    }),
  ]);

  return {
    data: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      bloodType: updatedUser.bloodType,
      location: updatedUser.location,
      city: updatedUser.city,
      profilePicture: updatedUser.profilePicture,
      totalDonations: updatedUser.totalDonations,
      availability: updatedUser.availability,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      userProfile: {
        bio: updatedUserProfile.bio,
        age: updatedUserProfile.age,
        lastDonationDate: updatedUserProfile.lastDonationDate,
        createdAt: updatedUserProfile.createdAt,
        updatedAt: updatedUserProfile.updatedAt,
      },
    },
  };
};

export const profileServices = {
  myProfile,
  updateProfile,
};
