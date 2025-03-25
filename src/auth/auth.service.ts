import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { stanizeUser } from 'src/utils/helper-functions';
import { ForgetPasswordDto } from './dto/forget-passowrd.dto';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtSerivce: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Sign up a new user
   * @param signUpDto - The sign up data
   * @returns The created user data
   */
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

  /**
   * Sign in an existing user
   * @param signInDto - The sign in data
   * @returns The access token and user data
   */
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

  /**
   *  Send a verification code to the user's email for password reset
   * @param forgetPasswordDto
   * @returns  - The status and message of the operation
   */
  public async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgetPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResetcode = this.encryptCode(code);
    user.verificationCode = hashResetcode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    const message = `Hi ${user.name} \n We received a request to reset your password on your BuyNow Account.\n ${code} \n Enter this code to reset your password.\n This code will expire in 10 minutes. \n Do not share this code with anyone. \n If you did not request a password reset, please ignore this email or reply to let us know. \n Thanks, \n The BuyNow Team`;

    // send email
    await this.mailService.sendEmail({
      to: user.email,
      subject: 'Password Reset Code',
      text: message,
    });

    return {
      status: 'success',
      message: 'Verification code sent to your email',
    };
  }
  
  /**
   * Encrypt the verification code using SHA-256
   * @param code
   * @returns
   */
  private encryptCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}
