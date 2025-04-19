import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrntUser } from 'src/utils/decorators/current_user_decorators';
import { JwtPayloadType } from 'src/utils/types';
import { MongoIdValidationPipe } from 'src/utils/pipes/mongo-id-validation.pipe';

@UseGuards(AuthGuard, AuthRolesGuard)
@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Post()
  @Roles(['user'])
  create(
    @Body() createRequestProductDto: CreateRequestProductDto,
    @CurrntUser() payload: JwtPayloadType,
  ) {
    console.log(payload);
    return this.requestProductService.create(
      createRequestProductDto,
      payload.id,
    );
  }

  @Get()
  @Roles(['admin'])
  getAllRequestedProducts(@Query() query: any) {
    return this.requestProductService.getAllRequestProducts(query);
  }

  @Get(':id')
  @Roles(['admin', 'user'])
  getSpecificRequestedProduct(@Param('id', MongoIdValidationPipe) id: string) {
    return this.requestProductService.getSpecificRequestProduct(id);
  }

  @Patch(':id')
  @Roles(['user'])
  update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
  ) {
    return this.requestProductService.updateRequestProduct(
      id,
      updateRequestProductDto,
    );
  }

  @Delete(':id')
  @Roles(['user'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', MongoIdValidationPipe) id: string) {
    await this.requestProductService.deleteRequestProduct(id);
  }
}
