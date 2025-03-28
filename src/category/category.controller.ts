import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { MongoIdValidationPipe } from 'src/utils/pipes/mongo-id-validation.pipe';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(['admin'])
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async createCategory( @Body() createCategoryDto: CreateCategoryDto,@UploadedFile() image?: Express.Multer.File,) {
    return this.categoryService.createCategory(createCategoryDto, image?.filename);
  }

  @Get()
  async getAllCategories(@Query() query: any) {
    return this.categoryService.getAllCategories(query);
  }

  @Get(':id')
  async getCategoryById(@Param('id', MongoIdValidationPipe) id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Patch(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(['admin'])
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async updateCatgory(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image?: Express.Multer.File

  ) {
    return this.categoryService.updateCatgory(id, updateCategoryDto,image?.filename);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id', MongoIdValidationPipe) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
