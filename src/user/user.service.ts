import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from 'src/utils/services/base.service';
import { JwtPayloadType } from 'src/utils/types';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

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
    createUserDto.password = await this.hashPassword(createUserDto.password);

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
  public async getAllUsers(query: any) {
    return await this.findAll(query, '', '-password');
  }

  /**
   * Find a user by ID
   * @param userId - The ID of the user to find
   * @access Admin
   * @returns The found user from the database
   */
  public async getSpecialUser(userId: string) {
    return await this.findOne(userId);
  }

  /**
   *
   * @param id - The ID of the user to update
   * @param updateUserDto  - The user data to update
   * @returns  The updated user from the database
   * @access Admin
   */
  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
    payload: JwtPayloadType,
  ) {
    await this.validateUserPermission(id, payload);
    return await this.updateOne(id, updateUserDto);
  }

  /**
   * Delete a user by ID
   * @param id - The ID of the user to delete
   * @returns  void
   * @access Admin
   */
  public async remove(id: string): Promise<void> {
    await this.deleteOne(id);
  }

  /**
   * Get user info
   * @param id - The ID of the user to get info for
   * @returns The user info from the database
   */
  public async getUserInfo(id: string) {
    return await this.findOne(id);
  }

  /**
   * Hash the password
   * @param createUserDto - The user data to hash
   * @returns The hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   *  Validate user permission
   * @param id
   * @param payload
   */
  private async validateUserPermission(id: string, payload: JwtPayloadType) {
    const user = await this.findOne(id);
    if (user.data._id.toString() !== payload.id && payload.role !== 'admin') {
      throw new BadRequestException('You are not allowed to update this user');
    }
  }
}
