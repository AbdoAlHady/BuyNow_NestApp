import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestProduct, RequestProductSchema } from './schemas/request-product.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [RequestProductController],
  providers: [RequestProductService],
  imports: [
    MongooseModule.forFeature([
      {
        name:RequestProduct.name,
        schema:RequestProductSchema
      }
    ]), 
    
    UserModule
  ],
})
export class RequestProductModule {}
