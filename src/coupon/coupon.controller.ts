import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AuthGuard,AuthRolesGuard)
  @Roles(['admin'])
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllCoupons(@Query() query: any) {
    return this.couponService.getAllCoupons(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard,AuthRolesGuard)
  @Roles(['admin'])
  getSpecificCoupon(@Param('id', MongoIdValidationPipe)id: string) {
    return this.couponService.getSpecificCoupon(id);
  }


  @Patch(':id')
  @UseGuards(AuthGuard,AuthRolesGuard)
  @Roles(['admin'])
  updateCoupon(@Param('id', MongoIdValidationPipe)id: string,@Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.updateCoupon(id, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard,AuthRolesGuard)
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCoupon(@Param('id', MongoIdValidationPipe)id: string) {
    return this.couponService.deleteCoupon(id);
  }

}
