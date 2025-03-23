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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MongoIdValidationPipe } from 'src/utils/pipes/mongo-id-validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuthGuard } from './guard/auth.guard';
// import { AuthRolesGuard } from './guard/auth-roles.guard';
// import { Roles } from './decorators/roles.decorator';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @UseGuards(AuthGuard,AuthRolesGuard)
  // @Roles(['admin'])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: any) {
    console.log(query);
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdValidationPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
   async remove(@Param('id', MongoIdValidationPipe) id: string) {
    await this.userService.remove(id);
  }
}
