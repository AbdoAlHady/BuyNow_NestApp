import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/types';
import { ProfileUpdateUserDto } from './dto/profile-update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getLoggedUserData(@CurrentUser() payload: JwtPayloadType) {
    return this.userService.getSpecialUser(payload.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateLoggedUser(
    @Body() profileUpdateUserDto: ProfileUpdateUserDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.userService.update(payload.id, profileUpdateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteLoggedUser(@CurrentUser() payload: JwtPayloadType) {
    return this.userService.remove(payload.id);
  }
  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.userService.changePassword(changePasswordDto, payload.id);
  }
}
