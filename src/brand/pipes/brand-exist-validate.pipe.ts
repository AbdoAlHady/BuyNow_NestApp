import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from 'src/brand/schema/brand.schema';

@Injectable()
export class BrandExistValidatePipe implements PipeTransform {
  constructor(@InjectModel(Brand.name) private readonly model: Model<Brand>) {}
  async transform(value: any) {
    const { brand } = value;
    if (brand) {
      const brandExist = await this.model.findById(brand);
      if (!brandExist) {
        throw new NotFoundException(`There is no brand with this id`);
      }
    }
    return value;
  }
}
