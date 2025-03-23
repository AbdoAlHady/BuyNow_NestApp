import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtSerivce: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signUp(signUpDto: SignInDto) {
    const user = await this.userModel.findOne({ email: signUpDto.email });
    if (user) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const createdUser = await this.userModel.create({
      ...signUpDto,
      password: hashedPassword,
    });
    return {
      status: 'success',
      message: 'User created successfully',
      user: createdUser,
    };
  }
}
