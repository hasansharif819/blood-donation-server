import { BloodGroup, Gender, UserRole } from "@prisma/client";
import { z } from "zod";

const registerUserZodValidationSchema = z.object({
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
    gender: z.enum([
      Gender.FEMALE,
      Gender.MALE,
      Gender.OTHERS
    ]),
    location: z.string(),
    availability: z.boolean().default(true),
    userId: z.string().optional(),
    bio: z.string().optional(),
    age: z.number(),
    lastDonationDate: z.string().optional(),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password  is required",
    }),
    newPassword: z.string({
      required_error: "New password  is required",
    }),
  }),
});

export const AuthValidation = {
  registerUserZodValidationSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
};
