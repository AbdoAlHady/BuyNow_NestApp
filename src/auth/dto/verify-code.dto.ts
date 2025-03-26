import { IsNotEmpty, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsNotEmpty({ message: 'Code is required' })
  @Length(6, 6, { message: 'Code must be 6 characters long' })
  code: string;
}
