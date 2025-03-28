import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category-schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BaseService } from 'src/utils/services/base.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }

  /**
   * Create a new category
   * @param createCategoryDto - The category data to create
   * @returns  The created category data from the database
   * @access  Only admin can create a category
   */
  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    image?: string,
  ) {
    const { name } = createCategoryDto;
    const existingCategory = await this.findCategoryByName(name);
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }
    if (image) {
      createCategoryDto.image = image;
    }
    return await this.createOne(createCategoryDto);
  }

  /**
   * Get all categories
   * @param query - The query parameters for filtering and pagination
   * @returns  An array of category data from the database
   * @access  All authenticated users can access this endpoint
   */
  public async getAllCategories(query: any) {
    return await this.findAll(query);
  }

  /**
   * Get a category by id
   * @param id - The id of the category to find
   * @returns  The found category data from the database
   * @access  All authenticated users can access this endpoint
   */
  public async getCategoryById(id: string) {
    return await this.findOne(id);
  }

  /**
   * Update a category by id
   * @param id
   * @param updateCategoryDto
   * @returns  The updated category data from the database
   * @access  Only admin can update a category
   */
  public async updateCatgory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: string,
  ) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    if (image) {
      if (category.image) {
        const imageName = category.image.split('/').pop();

        const imagePath = resolve('uploads/categories', imageName!);
        if (existsSync(imagePath)) {
          unlinkSync(imagePath);
          console.log('✅ Old image deleted:', imagePath);
        }
      }
      category.image = image;
    }
    category.name = updateCategoryDto.name ?? category.name;
    await category.save();
    return {
      data: category,
    };
  }

  /**
   * Delete a category by id
   * @param id
   * @returns  no content
   * @access  Only admin can delete a category
   */
  public async deleteCategory(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    this.removeCategoryImage(category);

    await this.deleteOne(id);
  }

  /**
   * Remove the category image from the file system
   * @param category - The category document to remove the image from
   * @access  private method, used internally
   */
  private removeCategoryImage(category: CategoryDocument) {
    if (category.image) {
      const imageName = category.image.split('/').pop();
      const imagePath = resolve('uploads/categories', imageName!);
      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
        console.log('✅ Old image deleted:', imagePath);
      }
    }
  }

  /**
   * Find a category by name
   * @param name - The name of the category to find
   * @returns  The found category data from the database
   * @access  private method, used internally
   */
  private async findCategoryByName(name: string) {
    const category = await this.categoryModel.findOne({ name });
    return category;
  }
}
