import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/common/validators/match.decorator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'old password is required' })
  @IsString({ message: 'old password must be a string' })
  @MinLength(3, { message: 'old password must be at least 3 characters long' })
  @MaxLength(20, { message: 'old password must be at most 20 characters long' })
  oldPassword: string;

  @IsNotEmpty({ message: 'new password is required' })
  @IsString({ message: 'new password must be a string' })
  @MinLength(3, { message: 'new password must be at least 3 characters long' })
  @MaxLength(20, { message: 'new password must be at most 20 characters long' })
  newPassword: string;
  @Match('newPassword', { message: 'confirm password does not match' })
  confirmPassword: string;
}
