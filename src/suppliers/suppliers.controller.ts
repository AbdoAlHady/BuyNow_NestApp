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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { MongoIdValidationPipe } from 'src/utils/pipes/mongo-id-validation.pipe';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.createSupplier(createSupplierDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllSuppliers(@Query() query: any) {
    return this.suppliersService.getAllSuppliers(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  getSpecificSupplier(@Param('id', MongoIdValidationPipe) id: string) {
    return this.suppliersService.getSpecificSupplier(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  updateSupplier(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.updateSupplier(id, updateSupplierDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSupplier(@Param('id', MongoIdValidationPipe) id: string) {
    return this.suppliersService.deleteSupplier(id);
  }
}
