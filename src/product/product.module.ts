import { BadRequestException, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    UserModule,
    CategoryModule,
    BrandModule,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 2, // 5MB
      },
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const filename = `${prefix}-${file.originalname.trim()}`;
          console.log('File name:', filename);
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true);
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('File is not supported'), false);
        }
      },
    }),
  ],
})
export class ProductModule {}
