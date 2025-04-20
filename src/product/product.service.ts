import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/utils/services/base.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {
    super(productModel);
  }

  /**
   * Create a new product
   * @param createProductDto
   * @returns  Product from the database
   * @access Admin
   */
  public async createProduct(createProductDto: CreateProductDto) {
    return await this.createOne(createProductDto);
  }

  /**
   * Get all products
   * @param query - query object to filter products
   * @returns  Products from the database
   * @access Public
   */
  public async getAllProducts(query: any) {
    return await this.findAll(query);
  }

  /**
   * Get a specific product
   * @param id  - product id to get
   * @returns  Product from the database
   * @access Public
   */
  public async getSpecificProduct(id: string) {
    return await this.findOne(id);
  }

  /**
   * Update a product
   * @param id - product id to update
   * @param updateProductDto - product data to update
   * @returns  Updated product from the database
   * @access Admin
   */

  public async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    return await this.updateOne(id, updateProductDto);
  }

  /**
   * Delete a product
   * @param id - product id to delete
   * @returns  Deleted product from the database
   * @access Admin
   */
  public async deleteProduct(id: string) {
    return await this.deleteOne(id);
  }
}
