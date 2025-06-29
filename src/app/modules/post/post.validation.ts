import { BloodGroup, PostStatus } from "@prisma/client";
import { z } from "zod";

// Validation schema for creating a new post
const createPostValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required!",
    }),
    numberOfBags: z
      .number({
        required_error: "Number of bags is required!",
      })
      .int()
      .positive(),
    bloodType: z.enum(
      [
        BloodGroup.A_POSITIVE,
        BloodGroup.A_NEGATIVE,
        BloodGroup.B_POSITIVE,
        BloodGroup.B_NEGATIVE,
        BloodGroup.AB_POSITIVE,
        BloodGroup.AB_NEGATIVE,
        BloodGroup.O_POSITIVE,
        BloodGroup.O_NEGATIVE,
      ],
      {
        required_error: "Blood type is required!",
      }
    ),
    hospitalName: z.string({
      required_error: "Hospital name is required!",
    }),
    hospitalAddress: z.string({
      required_error: "Hospital address is required!",
    }),
    city: z.string({
      required_error: "City is required!",
    }),
    reason: z.string({
      required_error: "Reason is required!",
    }),
    isManaged: z.boolean().optional().default(false),
    postStatus: z
      .enum([
        PostStatus.PENDING,
        PostStatus.APPROVED,
        PostStatus.REJECTED,
        PostStatus.FULFILLED,
      ])
      .optional()
      .default(PostStatus.PENDING),
  }),
});

// Validation schema for updating an existing post
const updateMyBloodPost = z.object({
  body: z
    .object({
      numberOfBags: z.number().int().positive().optional(),
      bloodType: z
        .enum([
          BloodGroup.A_POSITIVE,
          BloodGroup.A_NEGATIVE,
          BloodGroup.B_POSITIVE,
          BloodGroup.B_NEGATIVE,
          BloodGroup.AB_POSITIVE,
          BloodGroup.AB_NEGATIVE,
          BloodGroup.O_POSITIVE,
          BloodGroup.O_NEGATIVE,
        ])
        .optional(),
      hospitalName: z.string().optional(),
      hospitalAddress: z.string().optional(),
      reason: z.string().optional(),
      isManaged: z.boolean().optional(),
    })
    .strict(), // Prevent unknown fields
});

// Validation schema for updating post status
const updatePostStatus = z.object({
  body: z.object({
    postStatus: z.enum(
      [
        PostStatus.PENDING,
        PostStatus.APPROVED,
        PostStatus.REJECTED,
        PostStatus.FULFILLED,
      ],
      {
        required_error: "Post status is required!",
      }
    ),
  }),
});

export const postValidation = {
  createPostValidationSchema,
  updateMyBloodPost,
  updatePostStatus,
};
