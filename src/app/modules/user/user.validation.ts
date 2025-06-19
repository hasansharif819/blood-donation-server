import { UserRole, UserStatus } from "@prisma/client";
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
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
})
});

export const userValidation = {
  updateUser,
  updateUserByAdmin,
};
