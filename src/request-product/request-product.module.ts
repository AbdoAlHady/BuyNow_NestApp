import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';

@Module({
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
