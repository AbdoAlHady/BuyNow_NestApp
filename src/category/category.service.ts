import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category-schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BaseService } from 'src/utils/services/base.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
  public async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existingCategory = await this.findCategoryByName(name);
    if (existingCategory) {
      throw new BadRequestException('Category already exists');
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
  public async updateCatgory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.updateOne(id, updateCategoryDto);
  }

  /**
   * Delete a category by id
   * @param id 
   * @returns  no content
   * @access  Only admin can delete a category
   */
  public async deleteCategory(id: string) {
    return await this.deleteOne(id);
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
