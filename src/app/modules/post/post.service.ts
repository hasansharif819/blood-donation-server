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

// Retrieve posts where the user is a donor (approved posts)
const myDonationPosts = async (user: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: user.id,
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

  return posts;
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
  myDonationPosts,
  postsMadeByMe,
  updatePostStatus,
  updateMyPost,
  deleteMyPost,
};
