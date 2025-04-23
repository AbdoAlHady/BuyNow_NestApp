import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string ' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(30, { message: 'Name must be at most 10 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'Password must be at least 3 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'Role must be either admin or user' })
  role: string;

  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string;

  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18' })
  age: number;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @IsPhoneNumber('EG', { message: 'Phone must be a valid phone number' })
  @IsNotEmpty({ message: 'Phone is must be not empty' })
  phoneNumber: string;
 
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is must be not empty' })
  address: string;

  @IsEnum([true, false],{message:'Active must be either true or false'})
  @IsNotEmpty({ message: 'Active is must be not empty' })
  active: boolean;

  @IsOptional()
  @IsString({message:'Verification code must be a string'})
  @IsNotEmpty({message:'Verification code is must be not empty'})
  @Length(6, 6,{message:'Verification code must be exactly 6 characters long'})
  verificationCode: string;

  @IsOptional()
  @IsString({message:'Gender must be a string'})
  @IsNotEmpty({message:'Gender is must be not empty'})
  @IsEnum(['male','female'],{message:'Gender must be either male or female'})
  gender: string;
}
