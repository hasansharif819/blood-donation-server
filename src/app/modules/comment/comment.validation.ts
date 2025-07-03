import { z } from "zod";

const createCommentValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required!",
    }),
    postId: z.string({
      required_error: "Post ID is required!",
    }),
    content: z.string().optional(),
    image: z.string().optional(),
    parentId: z.string().optional(),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const commentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
