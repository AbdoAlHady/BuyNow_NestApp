import {
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/schemas/category-schema';

export class ValidateCategoryPipe implements PipeTransform {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async transform(value: any) {
    const { category } = value;
    console.log(category);
    if (category!==undefined) {
      const currentCategory = await this.categoryModel.findById(category);
      if (!currentCategory) {
        throw new NotFoundException('Category does not exist');
      }
    }

    return value;
  }
}
