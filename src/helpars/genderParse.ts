import { Gender } from "@prisma/client";

// Helper to parse gender safely
export const parseGender = (value: any): Gender | undefined => {
  if (typeof value !== 'string') return undefined;
  const upperVal = value.toUpperCase();
  if (Object.values(Gender).includes(upperVal as Gender)) {
    return upperVal as Gender;
  }
  return undefined;
};