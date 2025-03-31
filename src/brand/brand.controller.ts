import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { MongoIdValidationPipe } from 'src/utils/pipes/mongo-id-validation.pipe';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.brandService.createBrand(createBrandDto, image?.filename);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllBrands(@Query() query: any) {
    return this.brandService.getAllBrands(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  getSpecificBrand(@Param('id', MongoIdValidationPipe) id: string) {
    return this.brandService.getSpecificBrand(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  updateBrand(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.brandService.updateBrand(id, updateBrandDto, image?.filename);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBrand(@Param('id', MongoIdValidationPipe) id: string) {
    return this.brandService.deleteBrand(id);
  }
}
