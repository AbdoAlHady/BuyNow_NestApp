import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './schemas/tax.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private readonly taxModel: Model<Tax>) {}
  /**
   * Create Or Update a tax price and shipping price
   * @param createTaxDto - The tax price and shipping price
   * @returns  The created tax price and shipping price
   * @access Admin
   */
  public async createOrUpdateTax(createTaxDto: CreateTaxDto) {
    const tax = await this.taxModel.findOneAndUpdate({}, createTaxDto, {
      new: true,
      upsert: true,
    });
    return {
      status: 'success',
      data: tax,
    };
  }

  /**
   * Get tax price and shipping price
   * @returns  The tax price and shipping price
   * @access Admin
   */
  public async GetTax() {
    return {
      status: 'success',
      data: await this.taxModel.findOne({}),
    };
  }

  /**
   * reset tax price and shipping price
   * @returns  The updated tax price and shipping price
   * @access Admin
   */
  public async resetTax() {
    const tax = await this.taxModel.findOneAndUpdate(
      {},
      { taxPrice: 0, shippingPrice: 0 },
      { new: true },
    );
    return {
      status: 'success',
      data: tax,
      message: 'Tax price and shipping price reset successfully',
    };
  }
}
