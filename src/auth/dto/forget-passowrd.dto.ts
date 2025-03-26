import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordDto{
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
}