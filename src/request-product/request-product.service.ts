import { Injectable } from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';

@Injectable()
export class RequestProductService {
  create(createRequestProductDto: CreateRequestProductDto) {
    return 'This action adds a new requestProduct';
  }

  findAll() {
    return `This action returns all requestProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestProduct`;
  }

  update(id: number, updateRequestProductDto: UpdateRequestProductDto) {
    return `This action updates a #${id} requestProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestProduct`;
  }
}
