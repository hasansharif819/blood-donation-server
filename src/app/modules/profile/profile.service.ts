import prisma from "../../../shared/prisma";
import dayjs from 'dayjs';


//My Profile
const myProfile = async (user: any) => {
  console.log("User === ", user)
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
      city: true,
      profilePicture: true,
      totalDonations: true,
      status: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
      userProfile: true,
    },
  });
  return getMe;
};

//partial updating the user profile
const updateProfile = async (user: any, data: any) => {
  const userId = user.userId;

  console.log("userId === ", userId);
  console.log("data === ", data);

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
    contactNumber: data.contactNumber,
    lastDonationDate: data.lastDonationDate,
  };

  // console.log("user data = ", userData);

  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );
  const filteredUserProfileData = Object.fromEntries(
    Object.entries(userProfileData).filter(([_, v]) => v !== undefined)
  );

  const lastDonationDate = data.lastDonationDate;
    if (lastDonationDate) {
      const daysDiff = dayjs().diff(dayjs(lastDonationDate), 'day');
      if (daysDiff < 120) {
        filteredUserData.availability = false;
      } else {
        filteredUserData.availability = true;
    }
  }

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
        contactNumber: updatedUserProfile.contactNumber,
        lastDonationDate: updatedUserProfile.lastDonationDate,
        createdAt: updatedUserProfile.createdAt,
        updatedAt: updatedUserProfile.updatedAt,
      },
    },
  };
};

// update user profile picture
const updateUserProfilePicture = async (data: any) => {
  // console.log("Profile picture = ", data);
  const result = await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      profilePicture: data.profilePicture,
    },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
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
    },
  });
  return result;
};

export const profileServices = {
  myProfile,
  updateProfile,
  updateUserProfilePicture,
};
