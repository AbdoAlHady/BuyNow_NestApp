import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: 'Product is required' })
  @IsMongoId({ message: 'Product must be a valid id' })
  product: string;

  @IsNotEmpty({ message: 'color is required' })
  @IsString({ message: 'color must be a string' })
  color: string;
}
