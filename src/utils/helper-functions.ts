import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

import { Types } from 'mongoose';
import { UserSanitized } from './types';

export const sa = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid MongoDB ObjectId');
  }
};


export const stanizeUser = (user: any): UserSanitized => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser as UserSanitized;

}


export const generateCode = (): string => {
  const code=Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};

export const encryptCode = (code: string): string => {
  return crypto.createHash('sha256').update(code).digest('hex');
}