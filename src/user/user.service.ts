import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

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
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const newUser = await this.userModel.create({
      ...createUserDto,
      role: createUserDto.role ?? 'user',
    });
    return {
      status: 'success',
      message: 'User created successfully',
      data: newUser,
    };
  }

  /**
   * Get all users
   * @returns All users from the database
   * @access Admin
   */
  public async findAll() {
    const users = await this.userModel.find().select('-password');
    return {
      status: 'success',
      results: users.length,
      data: users,
    };
  }

  /**
   * Find a user by ID
   * @param userId - The ID of the user to find
   * @access Admin
   * @returns The found user from the database
   */
  public async findOne(userId: string) {
    const user = await this.userModel.findById(userId,{ password: 0 });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 'success',
      data: user,
    };
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
