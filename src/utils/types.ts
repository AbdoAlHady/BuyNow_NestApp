
export type JwtPayloadType = {
  id: string;
  role: string;
  iat: number;
};

export interface IPaginationResult {
  currentPage: number;
  limit: number;
  numbersOfPages: number;
  nextPage?: number;
  previousPage?: number;
}

// export type UserSanitized = Omit<
//   User,
//   | 'password'
//   | 'verificationCode'
//   | 'verificationCodeExpires'
//   | 'changePasswordDate'
// >;

export type SendEmailOptions = {
  to: string;
  from?: string;
  subject: string;
  template?: string;
  text?: string;
};
