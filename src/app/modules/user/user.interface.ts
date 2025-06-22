import { BloodGroup, Gender, User, UserRole, UserStatus } from "@prisma/client";

export interface IUserFilterRequest {
  searchTerm?: string;
  bloodType?: string;
  city?: string;
  location?: string;
  availability?: boolean;
  role?: string;
  status?: string;
}

export interface IPaginationOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IGenericResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: T;
}

// Define a SafeUser type excluding password and needPasswordChange
export type SafeUser = Omit<User, "password" | "needPasswordChange"> & {
  userProfile?: {
    id: string;
    userId: string;
    bio?: string;
    age?: number;
    lastDonationDate?: Date;
    gender?: Gender;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export type UserProfileRaw = {
  id: string;
  userId: string;
  bio?: string;
  age?: number;
  lastDonationDate?: string | Date;
  gender?: Gender;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRaw = Omit<User, "password" | "needPasswordChange"> & {
  userProfile?: UserProfileRaw | null;
};

export type SafeUserData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodType: BloodGroup;
  location: string;
  city: string | null;
  profilePicture: string | null;
  totalDonations: number;
  availability: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  userProfile: {
    id: string;
    userId: string;
    bio: string | null;
    age: number | null;
    lastDonationDate: string;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};
