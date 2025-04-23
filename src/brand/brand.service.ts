import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schema/brand.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/services/base.service';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { resolve } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

@Injectable()
export class BrandService extends BaseService<Brand> {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {
    super(brandModel);
  }

  public async createBrand(createBrandDto: CreateBrandDto, image?: string) {
    const brandExist = await this.getBrandByName(createBrandDto.name);
    if (brandExist) throw new BadRequestException('Brand already exists');

    if (image) {
      createBrandDto.image = image;
    }
    const brand = await this.brandModel.create(createBrandDto);
    return {
      status: 'success',
      data: brand,
    };
  }

  public async getAllBrands(query: any) {
    return await this.findAll(query);
  }

  public async getSpecificBrand(id: string) {
    return await this.findOne(id);
  }

  public async updateBrand(id: string, dto: UpdateBrandDto, image?: string) {
    const brand = await this.brandModel.findById(id);
    if (image) {
      this.handleImage(brand!);
      dto.image = image;
    }
    return await this.updateOne(id, dto);
  }

  public async deleteBrand(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) throw new BadRequestException('Brand not found');
    this.handleImage(brand);
    return await this.deleteOne(id);
  }

  private async getBrandByName(name: string) {
    const brand = await this.brandModel.findOne({ name });
    if (brand) throw new BadRequestException('Brand already exists');
    return brand;
  }

  private handleImage(brand: BrandDocument) {
    if (brand.image) {
      const imageName = brand.image.split('/').pop();
      const imagePath = resolve('uploads/brands', imageName!);
      if (existsSync(imagePath)) {
        unlinkSync(imagePath);
        console.log('✅ Old image deleted:', imagePath);
      }
    }
  }
}
