import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { CategoryExistValidatePipe } from '../common/pipes/category-exist-validate.pipe';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard, AuthRolesGuard)
  @UsePipes(CategoryExistValidatePipe)
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.createSubCategory(createSubcategoryDto);
  }

  @Get()
  getAllSubCategories(@Query() query: any) {
    return this.subcategoryService.getAllSubCategories(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  getSpecificSubCategory(@Param('id', MongoIdValidationPipe) id: string) {
    return this.subcategoryService.getSpecificSubCategory(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @UsePipes(CategoryExistValidatePipe)
  updateSubCategory(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.updateSubCategory(id, updateSubcategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.subcategoryService.deleteSubCategory(id);
  }
}
