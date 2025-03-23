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

export interface ISanitizedUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  active?: boolean;
  age?: number;
  address?: string;
  gender?: string;
}
