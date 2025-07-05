import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { dynamicCreateNotification } from "../../../utils/notificationMessageBuilder";

// Create a new blood donation post
const createPostApproval = async (user: any, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingPost = await prisma.post.findUnique({
    where: { id: payload.postId },
  });

  if (!existingPost) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  const postapprovals = await prisma.postApproval.create({
    data: {
      userId: user.userId,
      postId: payload.postId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      post: {
        select: {
          id: true,
          bloodType: true,
          numberOfBags: true,
          dateOfDonation: true,
          donationTime: true,
          hospitalName: true,
          hospitalAddress: true,
          city: true,
          reason: true,
          postStatus: true,
          isManaged: true,
        },
      },
    },
  });

  if (!postapprovals) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Post approval failed"
    );
  }

  // Create a notification for the post approval
  await dynamicCreateNotification({
    type: "POST_APPROVED",
    userId: existingPost.userId,
    actorId: user.userId,
    postId: payload.postId,
    status: "APPROVED",
  });

  return postapprovals;
};

const getAllPostsApproval = async (
  filters: any,
  options: { page: number; limit: number }
) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const { userId, postId } = filters;

  const where: any = {};

  if (userId !== undefined) where.userId = userId;
  if (postId) where.postId = postId;

  const [postApprovals, total] = await Promise.all([
    prisma.postApproval.findMany({
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
        post: {
          select: {
            id: true,
            bloodType: true,
            numberOfBags: true,
            dateOfDonation: true,
            donationTime: true,
            hospitalName: true,
            hospitalAddress: true,
            city: true,
            reason: true,
            postStatus: true,
            isManaged: true,
          },
        },
      },
    }),
    prisma.postApproval.count({ where }),
  ]);

  return {
    data: postApprovals,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

//Retrieve post Approval by Post ID
const getAllPostsApprovalsByPostID = async (postId: string) => {
  if (!postId) {
    throw new Error("postId is required.");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      bloodType: true,
      numberOfBags: true,
      dateOfDonation: true,
      donationTime: true,
      hospitalName: true,
      hospitalAddress: true,
      city: true,
      reason: true,
      postStatus: true,
      isManaged: true,
    },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  const approvedUsers = await prisma.postApproval.findMany({
    where: {
      postId,
      userId: { not: undefined },
    },
    orderBy: { createdAt: "desc" },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  let responseData = {
    ...post,
    approvedUsers: approvedUsers.map((approval) => approval.user),
  };

  return responseData;
};

//Retrieve post Approval by ME
const getPostsApprovalsApprovedByMe = async (
  user: any,
  page = 1,
  limit = 20
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const skip = (page - 1) * limit;

  const [postApprovals, total] = await Promise.all([
    prisma.postApproval.findMany({
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
        post: {
          select: {
            id: true,
            bloodType: true,
            numberOfBags: true,
            dateOfDonation: true,
            donationTime: true,
            hospitalName: true,
            hospitalAddress: true,
            city: true,
            reason: true,
            postStatus: true,
            isManaged: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.postApproval.count({
      where: {
        userId: user.userId,
      },
    }),
  ]);

  return {
    data: postApprovals,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Delete a post created by the user
const deleteMyPostApproval = async (id: string, user: any) => {
  const postApprovals = await prisma.postApproval.findUnique({
    where: { id },
  });
  if (!postApprovals) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post Approval is not found");
  }
  if (postApprovals.userId !== user.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized to delete this post Approval"
    );
  }

  const deletedPost = await prisma.postApproval.delete({
    where: { id },
  });

  return deletedPost;
};

export const postApprovalServices = {
  createPostApproval,
  getAllPostsApproval,
  getPostsApprovalsApprovedByMe,
  getAllPostsApprovalsByPostID,
  deleteMyPostApproval,
};
