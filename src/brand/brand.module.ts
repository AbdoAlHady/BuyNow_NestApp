import { BadRequestException, Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schema/brand.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
    ]),

    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 2, // 5MB
      },
      storage: diskStorage({
        destination: './uploads/brands',

        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
          const filename = `${prefix}-${file.originalname}`;
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
    UserModule // Add your Mongoose models here
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
