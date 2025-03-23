import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const validateMongoId = (id: string): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid MongoDB ObjectId');
  }
};