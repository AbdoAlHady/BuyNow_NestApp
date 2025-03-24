import { User } from "src/user/schemas/user.schema";

export type JwtPayloadType = {
  id: string;
  role: string;
};

export interface IPaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  nextPage?: number;
  previousPage?: number;
}

export type UserSanitized = Omit<User, "password">