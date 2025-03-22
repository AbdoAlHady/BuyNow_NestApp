import {Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: string ): string  {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error('Invalid MongoDB ObjectId');
    }
    return value;
  }
}
