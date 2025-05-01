import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartQuantityDto {
  @IsOptional()
  @IsEnum(['increase', 'decrease'], {
    message: 'Action must be either increase or decrease',
  })
  @IsString({ message: 'type must be a string' })
  @Transform(({ value }) => value ?? 'increase')
  type: string;

  @IsNotEmpty({ message: 'Product ID is required' })
  @IsMongoId({ message: 'Product ID must be a valid MongoDB ObjectId' })
  cartItem: string;
}
