import { BloodGroup, Gender, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const updateUser = z.object({
  body: z.object({
    name: z.string().optional(),
    bloodType: z.nativeEnum(BloodGroup).optional(),
    location: z.string().optional(),
    city: z.string().optional(),
    availability: z.boolean().optional(),
    totalDonations: z.number().optional(),
    bio: z.string().optional(),
    contactNumber: z.string().optional(),
    age: z.number().optional(),
    gender: z.nativeEnum(Gender).optional(),
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
