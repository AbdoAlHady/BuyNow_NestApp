import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/utils/validators/match.decorator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email is not valid' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @Match('password', { message: `confirm password don't same the password` })
  confirmPassword: string;
}
