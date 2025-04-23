import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CategoryExistValidatePipe } from 'src/common/pipes/category-exist-validate.pipe';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UpdateImagesDto } from './dto/update_images_dto';
import { BrandExistValidatePipe } from 'src/brand/pipes/brand-exist-validate.pipe';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @UsePipes(CategoryExistValidatePipe,BrandExistValidatePipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      imageCover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.productService.createProduct(
      createProductDto,
      files.imageCover?.[0].filename,
      files.images?.map((file) => file.filename),
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllCategories(@Query() query: any) {
    return this.productService.getAllProducts(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getSpecificProduct(@Param('id', MongoIdValidationPipe) id: string) {
    return this.productService.getSpecificProduct(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @UsePipes(CategoryExistValidatePipe,BrandExistValidatePipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  updateProduct(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', MongoIdValidationPipe) id: string) {
    return this.productService.deleteProduct(id);
  }

  @Post('image-cover/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @UseInterceptors(FileInterceptor('imageCover'))
  updateOrAddImageCover(
    @Param('id', MongoIdValidationPipe) id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.updateOrAddImageCover(id, image.filename);
  }
  @Post('images/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @UseInterceptors(FileInterceptor('image'))
  updateOrAddProductImages(
     @Body() updateImagesDto: UpdateImagesDto,
    @Param('id', MongoIdValidationPipe) id: string,
    @UploadedFile() image: Express.Multer.File,
   
  ) {
    return this.productService.updateOrAddImages(id, image.filename,updateImagesDto);
  }
}
