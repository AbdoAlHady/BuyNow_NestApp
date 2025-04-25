import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { Product, ProductSchema } from 'src/product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name:Review.name,
        schema:ReviewSchema
      },
      {
        name:Product.name,
        schema:ProductSchema
      }
    ]),

    UserModule,
    ProductModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
