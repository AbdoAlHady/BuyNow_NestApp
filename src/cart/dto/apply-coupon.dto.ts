import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ApplyCouponDto {
  @IsNotEmpty({ message: 'Coupon code is required' })
  @IsString({ message: 'Coupon code must be a string' })
  @Length(3, 100, {
    message: 'Coupon code must be between 3 and 100 characters long',
  })
  coupon: string; // Assuming coupon is an ObjectId, change to string if it's a string
}
