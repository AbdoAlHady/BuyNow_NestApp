import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class ProfileUpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'password',
    'active',
    'email',
    'role',
    'verificationCode',
  ] as const),
) {}
