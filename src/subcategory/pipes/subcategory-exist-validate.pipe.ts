import { NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from '../schema/subcategory.schema';
import { Model } from 'mongoose';

export class SubCategoryExistValidatePipe implements PipeTransform {
  constructor(
    @InjectModel(SubCategory.name) private readonly model: Model<SubCategory>,
  ) {}
  async transform(value: any) {
    const { subCategory } = value;
    if (subCategory) {
      const subCategoryExist = await this.model.findById(subCategory);
      if (!subCategoryExist) {
        throw new NotFoundException(`There is no subcategory with this id`);
      }
    }
    return value;
  }
}
