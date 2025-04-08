import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty({ message: 'Coupon name is required' })
  @IsString({ message: 'Coupon name must be a string' })
  @Length(3, 100, {
    message: 'Coupon name must be between 3 and 100 characters',
  })
  name: string;

  @IsNotEmpty({ message: 'Expire date is required' })
  @IsDate({ message: 'Expire date must be a valid date' })
  expireDate: Date;

  @IsNotEmpty({ message: 'Discount is required' })
  @IsNumber({}, { message: 'Discount must be a number' })
  @IsNumber({}, { message: 'Discount must be a positive number' })
  @Min(0, { message: 'Discount must be a positive number' })
  discount: number;
}
