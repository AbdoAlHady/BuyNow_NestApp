import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTaxDto {
  @IsOptional()
  @IsNumber({}, { message: 'Tax price must be a number' })
  @Min(0, { message: 'Tax price must be greater than or equal to 0' })
  taxPrice: number;
  @IsOptional()
  @IsNumber({}, { message: 'Tax price must be a number' })
  @Min(0, { message: 'Tax price must be greater than or equal to 0' })
  shippingPrice: number;
}
