import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthRolesGuard } from '../auth/guard/auth-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  findAll(@Query() query: any) {
    return this.userService.getAllUsers(query);
  }
  @Get(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.userService.getSpecialUser(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', MongoIdValidationPipe) id: string) {
    await this.userService.remove(id);
  }
}
