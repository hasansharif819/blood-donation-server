import { BloodGroup, RequestStatus } from "@prisma/client";
import { z } from "zod";

const createRequest = z.object({
  body: z.object({
    donorId: z.string({
      required_error: "DonorId is required!",
    }),
    requesterId: z.string().optional(),
    phoneNumber: z.string({
      required_error: "Phone number is required!",
    }),
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
    dateOfDonation: z.string({
      required_error: "Date of Donation is required!",
    }),
    hospitalName: z.string({
      required_error: "Hospital name is required!",
    }),
    hospitalAddress: z.string({
      required_error: "Hospital address is required!",
    }),
    reason: z.string({
      required_error: "Reason is required!",
    }),
    requestStatus: z
      .enum([
        RequestStatus.PENDING,
        RequestStatus.APPROVED,
        RequestStatus.REJECTED,
      ])
      .default(RequestStatus.PENDING),
  }),
});

//Update My Request
const updateMyBloodRequest = z.object({
  body: z.object({
    donorId: z.string().optional(),
    phoneNumber: z.string().optional(),
    bloodType: z
      .enum([
        BloodGroup.AB_NEGATIVE,
        BloodGroup.AB_POSITIVE,
        BloodGroup.A_NEGATIVE,
        BloodGroup.A_POSITIVE,
        BloodGroup.B_NEGATIVE,
        BloodGroup.B_POSITIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.O_POSITIVE,
      ])
      .optional(),
    dateOfDonation: z.string().optional(),
    hospitalName: z.string().optional(),
    hospitalAddress: z.string().optional(),
    reason: z.string().optional(),
  }),
});

const updateRequest = z.object({
  body: z.object({
    requestStatus: z.enum([
      RequestStatus.PENDING,
      RequestStatus.APPROVED,
      RequestStatus.REJECTED,
    ]),
  }),
});

export const requestValidation = {
  createRequest,
  updateMyBloodRequest,
  updateRequest,
};
