import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";

const createComment = async (user: any, payload: any) => {
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

  const comment = await prisma.comment.create({
    data: {
      userId: user.userId,
      postId: payload.postId,
      content: payload.content,
      image: payload.image,
      parentId: payload.parentId,
    },
  });

  return comment;
};

const getCommentsByPostId = async (
  postId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
        isActive: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        replies: {
          where: {
            isActive: true, // ✅ only active replies
          },
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    }),
    prisma.comment.count({
      where: {
        postId,
        parentId: null,
        isActive: true,
      },
    }),
  ]);

  return {
    data: comments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getReplyByParentId = async (commentId: string) => {
  const replies = await prisma.comment.findMany({
    where: { parentId: commentId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });

  if (!replies || replies.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Replies not found");
  }

  return replies;
};

const updateComment = async (
  userId: string,
  commentId: string,
  payload: any
) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (existingComment.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only update your own comments"
    );
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content: payload.content,
      image: payload.image,
    },
  });

  return updatedComment;
};

const deleteComment = async (userId: string, commentId: string) => {
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existingComment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (existingComment.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only delete your own comments"
    );
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: {
      isActive: false,
    },
  });

  return { message: "Comment deleted successfully" };
};

export const commentService = {
  createComment,
  getCommentsByPostId,
  getReplyByParentId,
  updateComment,
  deleteComment,
};
