import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/services/base.service';
import { handleImage } from 'src/utils/helper-functions';
import { UpdateImagesDto } from './dto/update_images_dto';

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
  public async createProduct(
    createProductDto: CreateProductDto,
    imageCover?: string,
    images?: string[],
  ) {
    if (imageCover) createProductDto.imageCover = imageCover.trim();
    if (images) createProductDto.images = images.map((img) => img.trim());
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

  /**
   * Update product image cover
   * @param id - product id to update
   * @param imageCover  - image cover to update
   * @returns  Updated product from the database
   * @access Admin
   */
  public async updateOrAddImageCover(id: string, imageCover: string) {
    const product = await this.findProductById(id);
    if (product.imageCover) {
      handleImage(product.imageCover, 'products');
    }
    product.imageCover = imageCover;
    await product.save();
    return {
      status: 'success',
      message: 'Image cover updated successfully',
      data: product,
    };
  }

  /**
   * Update product images (update single image)
   * @param id - product id to update
   * @param image  - image to update
   * @returns  Updated product from the database
   * @access Admin
   */

  public async updateOrAddImages(
    id: string,
    image: string,
    updateImagesDto: UpdateImagesDto,
  ) {
    const product = await this.findProductById(id);
    if (updateImagesDto.oldImage) {
      if (product.images.includes(updateImagesDto.oldImage)) {
        console.log('old image found in the product images');
        const index = product.images.findIndex(
          (img) => img === updateImagesDto.oldImage,
        );
        if (index !== -1) {
          handleImage(product.images[index], 'products');
          product.images.splice(index, 1);
        }
      } else {
        throw new NotFoundException('Image not found in the product images');
      }
    }
    product.images.push(image);
    await product.save();
    return {
      status: 'success',
      message: 'Image updated successfully',
      data: product,
    };
  }

  private async findProductById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
