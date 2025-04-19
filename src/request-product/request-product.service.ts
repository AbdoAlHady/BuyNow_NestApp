import { Injectable } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { BaseService } from 'src/utils/services/base.service';
import { RequestProduct } from './schemas/request-product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RequestProductService extends BaseService<RequestProduct> {
  constructor(
    @InjectModel(RequestProduct.name)
    private readonly requestModel: Model<RequestProduct>,
  ) {
    super(requestModel);
  }

  /**
   * Create a new request product
   * @param createRequestProductDto - Request product data to create
   * @param userId - User ID to associate with the request product
   * @returns  New Request Product From Database
   * @access User
   */
  create(createRequestProductDto: CreateRequestProductDto, userId: string) {
    return this.createOne({
      ...createRequestProductDto,
      user: userId,
    });
  }

  /**
   * Get all request products
   * @param query - Query to find request products
   * @returns  All request products from database
   * @access Admin
   */
  public async getAllRequestProducts(query: any) {
    return await this.findAll(query);
  }

  /**
   * Get a request product by id
   * @param id - Request product ID to find
   * @returns  Request product from database
   * @access admin, user
   */
  public async getSpecificRequestProduct(id: string) {
    return await this.findOne(id);
  }

  /**
   *  Update a request product
   * @param id  - Request product ID to find
   * @param updateRequestProductDto  - Request product data to update
   * @returns The updated request product from database
   * @access user
   */
  public async updateRequestProduct(
    id: string,
    updateRequestProductDto: UpdateRequestProductDto,
  ) {
    return await this.updateOne(id, updateRequestProductDto);
  }

  /**
   *  Delete a request product
   * @param id  - Request product ID to find
   * @returns The deleted request product from database
   * @access  user
   */
  public async deleteRequestProduct(id: string) {
    await this.deleteOne(id);
  }
}
