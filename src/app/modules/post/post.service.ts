import { Post, PostStatus, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

// Create a new blood donation post
const createPost = async (user: any, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const post = await prisma.post.create({
    data: {
      userId: user.userId,
      bloodType: payload.bloodType,
      numberOfBags: payload.numberOfBags,
      dateOfDonation: payload.dateOfDonation,
      donationTime: payload.donationTime,
      hospitalName: payload.hospitalName,
      hospitalAddress: payload.hospitalAddress,
      city: payload.city,
      reason: payload.reason,
      isManaged: payload.isManaged ?? false,
      postStatus: payload.postStatus ?? PostStatus.PENDING,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return post;
};

const getAllPosts = async (
  filters: any,
  options: { page: number; limit: number }
) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const {
    bloodType,
    numberOfBags,
    dateOfDonation,
    donationTime,
    hospitalName,
    hospitalAddress,
    city,
    reason,
    postStatus,
    isManaged,
    isActive,
  } = filters;

  const where: any = {};

  if (isActive !== undefined) where.isActive = isActive === "true";
  if (bloodType) where.bloodType = bloodType;
  if (numberOfBags) where.numberOfBags = parseInt(numberOfBags);
  if (dateOfDonation) where.dateOfDonation = new Date(dateOfDonation);
  if (donationTime)
    where.donationTime = { contains: donationTime, mode: "insensitive" };
  if (hospitalName)
    where.hospitalName = { contains: hospitalName, mode: "insensitive" };
  if (hospitalAddress)
    where.hospitalAddress = { contains: hospitalAddress, mode: "insensitive" };
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (reason) where.reason = { contains: reason, mode: "insensitive" };
  if (postStatus)
    where.postStatus = { contains: postStatus, mode: "insensitive" };
  if (isManaged !== undefined) where.isManaged = isManaged === "true";

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Retrieve posts created by the user
const postsMadeByMe = async (user: any, page = 1, limit = 12) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.post.count({
      where: {
        userId: user.userId,
      },
    }),
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update post status (admin or post creator)
const updatePostStatus = async (id: string, user: any, payload: any) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (user.role !== UserRole.ADMIN && user.userId !== post.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to update post status"
    );
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      postStatus: payload.postStatus,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedPost;
};

// Update details of a post created by the user
const updateMyPost = async (id: string, user: any, payload: any) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  if (post.userId !== user.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to update this post"
    );
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      bloodType: payload.bloodType,
      numberOfBags: payload.numberOfBags,
      hospitalName: payload.hospitalName,
      hospitalAddress: payload.hospitalAddress,
      city: payload.city,
      dateOfDonation: payload.dateOfDonation,
      donationTime: payload.donationTime,
      postStatus: payload.postStatus,
      isActive: payload.isActive,
      reason: payload.reason,
      isManaged: payload.isManaged,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedPost;
};

// Delete a post created by the user
const deleteMyPost = async (id: string, user: any) => {
  const post = await prisma.post.findUnique({
    where: { id },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  if (post.userId !== user.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to delete this post"
    );
  }

  const deletedPost = await prisma.post.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  return deletedPost;
};

export const postServices = {
  createPost,
  getAllPosts,
  postsMadeByMe,
  updatePostStatus,
  updateMyPost,
  deleteMyPost,
};
