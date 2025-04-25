import { NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { Model } from 'mongoose';

export class ProductExistValidatePipe implements PipeTransform {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  async transform(value: any) {
    const productId = typeof value === 'string' ? value : value?.product;


    if (productId) {
      const productExist = await this.productModel.findById(productId);
      if (!productExist) {
        throw new NotFoundException('There is no product with this id');
      }
    }
    return value;
  }
}
