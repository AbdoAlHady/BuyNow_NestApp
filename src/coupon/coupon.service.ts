import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from './schemas/coupon.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class CouponService extends BaseService<Coupon> {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {
    super(couponModel);
  }

  /**
   *  Create a new coupon
   * @param createCouponDto - The coupon data to be created
   * @returns  New coupon from the database
   * @access Admin
   */
  public async create(createCouponDto: CreateCouponDto) {
    await this.getCouponByName(createCouponDto.name);
    const coupon = await this.createOne(createCouponDto);
    return coupon;
  }

  /**
   * Get All coupons
   * @param query - The query parameters to filter the coupons
   * @returns  All coupons from the database
   * @access public
   */
  public async getAllCoupons(query: any) {
    return await this.findAll(query);
  }

  /**
   *  Update a coupon by id
   * @param id - The id of the coupon to be updated
   * @returns  The updated coupon from the database
   * @access Admin
   */
  public async getSpecificCoupon(id: string) {
    return await this.findOne(id);
  }

  /**
   * Update a coupon by id
   * @param id - The id of the coupon to be updated
   * @param updateCouponDto
   * @returns  The updated coupon from the database
   * @access Admin
   */
  public async updateCoupon(id: string, updateCouponDto: UpdateCouponDto) {
    if (updateCouponDto.name) {
      await this.getCouponByName(updateCouponDto.name);
    }
    return this.updateOne(id, updateCouponDto);
  }

  /**
   * Delete a coupon by id
   * @param id - The id of the coupon to be deleted
   * @returns  The deleted coupon from the database
   * @access Admin
   */
  public async deleteCoupon(id: string) {
    return await this.deleteOne(id);
  }

  /**
   *  Check if a coupon with the given name already exists
   * @param name - The name of the coupon to be checked
   */
  private async getCouponByName(name: string) {
    const coupon = await this.couponModel.findOne({ name });
    if (coupon) {
      throw new BadRequestException('Coupon already exists');
    }
  }
}
