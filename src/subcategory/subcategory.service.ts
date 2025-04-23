import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './schema/subcategory.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/services/base.service';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService extends BaseService<SubCategory> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subcategoryModel: Model<SubCategory>,
  ) {
    super(subcategoryModel);
  }

  /**
   * Create a new subcategory
   * @param createSubcategoryDto - create subcategory data
   * @returns created subcategory from db
   * @access Only for admin
   */
  public async createSubCategory(createSubcategoryDto: CreateSubcategoryDto) {
    await this.getSubCategoryByName(createSubcategoryDto.name);
    return await this.createOne({
      name: createSubcategoryDto.name,
      category: createSubcategoryDto.category,
    });
  }

  /**
   * Get all subcategories
   * @param query - query params
   * @returns all subcategories
   */
  public async getAllSubCategories(query: any) {
    return await this.findAll(query, 'category');
  }

  /**
   * Get specific subcategory by id
   * @param id - subcategory id
   * @returns  subcategory from db
   * @access Only for admin
   */
  public async getSpecificSubCategory(id: string) {
    return await this.findOne(id, 'category');
  }

  /**
   * Update subcategory
   * @param id - subcategory id
   * @param updateSubcategoryDto - update subcategory data
   * @returns updated subcategory
   * @access Only for admin
   */
  public async updateSubCategory(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    if (updateSubcategoryDto.name) {
      await this.getSubCategoryByName(updateSubcategoryDto.name);
    }

    return await this.updateOne(id, updateSubcategoryDto);
  }

  /**
   * Delete subcategory
   * @param id - subcategory id
   * @returns deleted subcategory
   * @access Only for admin
   */
  public async deleteSubCategory(id: string) {
    await this.deleteOne(id);
  }

  /**
   * Get subcategory by name
   * @param name - subcategory name
   * @returns subcategory
   */
  private async getSubCategoryByName(name: string) {
    const category = await this.subcategoryModel.findOne({ name });
    if (category) {
      throw new BadRequestException('There is already a subcategory with this name');
    }
  }
}
