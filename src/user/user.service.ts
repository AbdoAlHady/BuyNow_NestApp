import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { validateMongoId } from 'src/utils/helper-functions';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Create a new user
   * @param createUserDto - The user data to create
   * @returns  The created user from the database
   * @access Admin
   */
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  public async findAll() {
    return await this.userModel.find();
  }
  /**
   * Find a user by ID
   * @param userId - The ID of the user to find
   * @access Admin 
   * @returns The found user from the database
   */
  public async findOne(userId: string) {
    validateMongoId(userId);
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
