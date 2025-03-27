import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { MongoIdValidationPipe } from 'src/utils/pipes/mongo-id-validation.pipe';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllCategories(@Query() query: any) {
    return this.categoryService.getAllCategories(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getCategoryById(@Param('id',MongoIdValidationPipe) id: string) {
    return this.categoryService.getCategoryById(id);
  }
}
