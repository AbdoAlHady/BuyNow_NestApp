import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserSanitized } from './types';
import { User } from 'src/user/schemas/user.schema';

export const sa = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid MongoDB ObjectId');
  }
};


export const stanizeUser = (user: any): UserSanitized => {
  const { password, ...sanitizedUser } = user.toObject();
  return sanitizedUser as UserSanitized;
  
}