import { UserRole, UserStatus, BloodGroup } from "@prisma/client";
import { z } from "zod";

const createUser = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email must be a valid email address.",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
    role: z
      .enum([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER])
      .default(UserRole.USER),
    bloodType: z.enum([
      BloodGroup.AB_NEGATIVE,
      BloodGroup.AB_POSITIVE,
      BloodGroup.A_NEGATIVE,
      BloodGroup.A_POSITIVE,
      BloodGroup.B_NEGATIVE,
      BloodGroup.B_POSITIVE,
      BloodGroup.O_NEGATIVE,
      BloodGroup.O_POSITIVE,
    ]),
    location: z.string(),
    availability: z.boolean().default(true),
    userId: z.string().optional(),
    bio: z.string().optional(),
    age: z.number(),
    lastDonationDate: z.string().optional(),
  }),
});

const updateUser = z.object({
  body: z.object({
    bio: z.string().optional(),
    age: z.number().optional(),
    lastDonationDate: z.string().optional(),
  }),
});

//update user by admin
const updateUserByAdmin = z.object({
  body: z.object({
    role: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const userValidation = {
  createUser,
  updateUser,
  updateUserByAdmin,
};
