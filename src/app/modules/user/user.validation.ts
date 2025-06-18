import { z } from "zod";

const updateUser = z.object({
  body: z.object({
    bio: z.string().optional(),
    age: z.number().optional(),
    lastDonationDate: z.string().optional(),
  }),
});

const updateUserByAdmin = z.object({
  body: z.object({
    role: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const userValidation = {
  updateUser,
  updateUserByAdmin,
};
