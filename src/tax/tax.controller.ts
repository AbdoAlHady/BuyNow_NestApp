import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthGuard, AuthRolesGuard)
@Controller('taxs')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @Roles(['admin'])
  createOrUpdateTax(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createOrUpdateTax(createTaxDto);
  }

  @Get()
  @Roles(['user','admin'])
  getTax() {
    return this.taxService.GetTax();
  }

  @Patch()
  @Roles(['admin'])
  resetTax() {
    return this.taxService.resetTax();
  }
}
