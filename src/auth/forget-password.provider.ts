import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgetPasswordDto } from './dto/forget-passowrd.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { generateCode } from 'src/utils/helper-functions';

@Injectable()
export class ForgetPasswordProvider {
  constructor(@InjectModel(User.name) private userModel: Model<User>,private readonly mailService:MailService) {}

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
    const code =generateCode();
    const hashResetcode = this.encryptCode(code);
    user.verificationCode = hashResetcode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    const message = `Hi ${user.name} \n We received a request to reset your password on your BuyNow Account.\n ${code} \n Enter this code to reset your password.\n This code will expire in 10 minutes. \n Do not share this code with anyone. \n If you did not request a password reset, please ignore this email or reply to let us know. \n Thanks, \n The BuyNow Team`;

    // send email
    try {
      await this.mailService.sendEmail({
        to: user.email,
        subject: 'Your password reset code (valid for 10 minutes)',
        text: message,
      });
    } catch (error) {
      console.log(error);
      user.verificationCode = undefined as any;
      user.verificationCodeExpires = undefined as any;
      await user.save();
      throw new BadRequestException(
        'There is an error sending email. Try again later',
      );
    }

    return {
      status: 'success',
      message: 'Verification code sent to your email',
    };
  }

    /**
     *  reset the password of the user
     * @param resetPasswordDto - The reset password data
     * @returns - The status and message of the operation
     */

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    user.password = await bcrypt.hash(resetPasswordDto.password, 10);
    user.verificationCode = undefined as any;
    user.verificationCodeExpires = undefined as any;
    user.changePasswordDate = new Date(Date.now());
    await user.save();
    return {
      status: 'success',
      message: 'Password reset successfully',
    };
  }

  /**
   * Encrypt the verification code using SHA-256
   * @param code
   * @returns
   */
  public encryptCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }
}
