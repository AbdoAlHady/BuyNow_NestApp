import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { stanizeUser } from 'src/utils/helper-functions';

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
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const createdUser = await this.userModel.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return {
      status: 'success',
      message: 'User created successfully',
      user: stanizeUser(createdUser),
    };
  }

  public async signIn(signInDto: SignInDto) {
    const user = await this.userModel.findOne({ email: signInDto.email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    const accessToken = this.jwtSerivce.sign(
      { id: user.id, role: user.role },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      },
    );
    return {
      status: 'success',
      message: 'User logged in successfully',
      data: stanizeUser(user),
      accessToken,
    };
  }
}
