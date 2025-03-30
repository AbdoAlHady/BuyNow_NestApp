import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schema/brand.schema';
import { Model } from 'mongoose';
import { BaseService } from 'src/utils/services/base.service';

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
    return brand;
  }

  public async getAllBrands(query:any) {
    return await this.findAll(query);
  }

  private async getBrandByName(name: string) {
    return await this.brandModel.findOne({ name });
  }
}
