import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  @Exclude()
  password: string;
  role: string;
  active: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  verificationCode: string;
  @Exclude()
  verificationCodeExpires: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
