import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { generateCode, stanizeUser } from 'src/utils/helper-functions';
import { ForgetPasswordDto } from './dto/forget-passowrd.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ForgetPasswordProvider } from './forget-password.provider';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtSerivce: JwtService,
    private readonly configService: ConfigService,
    private readonly forgetPasswordProvider: ForgetPasswordProvider,
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

    const code = generateCode();
    const hashResetcode = this.forgetPasswordProvider.encryptCode(code);
    createdUser.verificationCode = hashResetcode;
    createdUser.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await createdUser.save();

    const message = `Hi ${createdUser.name} \n Welcome to BuyNow! \n Your verification code is ${code}. \n This code will expire in 10 minutes. \n Do not share this code with anyone. \n If you did not request a password reset, please ignore this email or reply to let us know. \n Thanks, \n The BuyNow Team`;
    // send email
    await this.mailService.sendEmail({
      to: createdUser.email,
      subject: 'Your verification code (valid for 10 minutes)',
      text: message,
    });

    return {
      status: 'success',
      message:
        'User created successfully, please check your email for verification code',
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
    return this.forgetPasswordProvider.forgetPassword(forgetPasswordDto);
  }

  /**
   * Verify the reset password code
   * @param verifyPasswardCodeDto
   * @returns - The status of the operation
   */
  public async verifyResetPasswordCode(verifyPasswardCodeDto: VerifyCodeDto) {
    await this.verifyCode(verifyPasswardCodeDto.code);
    return {
      status: 'success',
      message: 'Reset code verified successfully',
    };
  }

  /**
   * Reset the user's password
   * @param resetPasswordDto - The reset password data
   * @returns The status of the operation
   */

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.forgetPasswordProvider.resetPassword(resetPasswordDto);
  }

  /**
   *  Verify the user's account using the verification code
   * @param verifyCodeDto
   * @returns  - The status and message of the operation
   */
  public async verifyEmail(verifyCodeDto: VerifyCodeDto) {
    const { code } = verifyCodeDto;
    const user = await this.verifyCode(code);
    user.isVerified = true;
    user.verificationCode = null as any;
    user.verificationCodeExpires = null as any;
    await user.save();
    return {
      status: 'success',
      message: 'Account verified successfully',
    };
  }

  /**
   * Reset the user's password
   * @param verifyCodeDto - The reset password data
   * @returns The status of the operation
   */
  private async verifyCode(code: string) {
    const user = await this.userModel.findOne({
      verificationCode: this.forgetPasswordProvider.encryptCode(code),
      verificationCodeExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new BadRequestException('Invalid or Expired reset code');
    }
    return user;
  }
}
