import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserExistValidatePipe implements PipeTransform {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
 async transform(value: any) {
    const userId = typeof value === 'string' ? value : value?.id;
    if (userId) {
      const user =await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException ('This id does not belong to any user');
      }
    }
    return value;
  }
}
