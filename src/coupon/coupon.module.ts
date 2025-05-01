import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
  imports: [
    MongooseModule.forFeature([{
      schema:CouponSchema,
      name: Coupon.name,
    }]),
    UserModule,
  ],

})
export class CouponModule {}
