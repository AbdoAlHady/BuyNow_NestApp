import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/utils/services/base.service';

@Injectable()
export class SuppliersService extends BaseService<Supplier> {
  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>,
  ) {
    super(supplierModel);
  }
  /**
   * Create a new supplier
   * @param createSupplierDto - Supplier data to create
   * @returns  New Supplier From Database
   * @access Admin
   */
  public async createSupplier(createSupplierDto: CreateSupplierDto) {
    await this.getSupplierByName(createSupplierDto.name);
    return await this.createOne(createSupplierDto);
  }

  /**
   *  Update a supplier
   * @param query  - Query to find suppliers
   * @returns  All suppliers from database
   * @access public
   */
  public async getAllSuppliers(query: any) {
    return await this.findAll(query);
  }

  /**
   * Get a supplier by id
   * @param id - Supplier ID to find
   * @returns  Supplier from database
   * @access admin
   */
  public async getSpecificSupplier(id: string) {
    return await this.findOne(id);
  }

  /**
   *  Update a supplier
   * @param id  - Supplier ID to find
   * @param updateSupplierDto  - Supplier data to update
   * @returns The updated supplier from database
   * @access admin
   */
  public async updateSupplier(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    if (updateSupplierDto.name) {
      await this.getSupplierByName(updateSupplierDto.name);
    }
    return await this.updateOne(id, updateSupplierDto);
  }

  /**
   *  Delete a supplier
   * @param id  - Supplier ID to find
   * @returns The deleted supplier from database
   * @access admin
   */
  public async deleteSupplier(id: string) {
    await this.deleteOne(id);
  }

  private async getSupplierByName(name: string) {
    const supplier = await this.supplierModel.findOne({ name: name });
    if (supplier) throw new BadRequestException('Supplier already exists');
  }
}
