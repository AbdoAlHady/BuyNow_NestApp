import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

import { Types } from 'mongoose';

export const sa = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid MongoDB ObjectId');
  }
};

export const stanizeUser = (user: any) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    age: user.age,
    phoneNumber: user.phoneNumber,
    address: user.address,
    active: user.active,
    isVerified: user.isVerified,
    gender: user.gender,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const generateCode = (): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};

export const encryptCode = (code: string): string => {
  return crypto.createHash('sha256').update(code).digest('hex');
};
