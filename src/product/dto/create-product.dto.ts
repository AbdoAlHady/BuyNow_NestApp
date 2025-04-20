import {
    IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MinLength(3, { message: 'title must be at least 3 characters long' })
  title: string;

  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(20, { message: 'description must be at least 20 characters long' })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'quantity must be a number' })
  @IsNotEmpty({ message: 'quantity must be not empty' })
  @Min(1, { message: 'quantity must be at least 1' })
  @Max(500, { message: 'quantity must be at most 500' })
  quantity: number;

  @IsOptional()
  @IsUrl({}, { message: 'imageCover must be a valid URL' })
  imageCover: string;

  @IsOptional()
  @IsUrl({}, { each: true, message: 'images must be valid URLs' })
  images: string[];

  @IsOptional()
  @IsNumber({}, { message: 'sold must be a number' })
  @IsNotEmpty({ message: 'sold must be not empty' })
  @Min(0, { message: 'sold must be at least 0' })
  sold: number;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber({}, { message: 'price must be a number' })
  @Min(1, { message: 'price must be at least 1' })
  @Max(20000, { message: 'price must be at most 20000' })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'price after discount must be a number' })
  @IsNotEmpty({ message: 'price after discount must be not empty' })
  @Min(1, { message: 'price after discount must be at least 1' })
  @Max(20000, { message: 'price after discount must be at most 20000' })
  priceAfterDiscount: number;

  @IsOptional()
  @IsArray({ message: 'colors must be an array' })
  @IsString({ each: true, message: 'color must be a string' })
  @IsNotEmpty({ message: 'color must be not empty' })
  colors: string[];

  @IsNotEmpty({ message: 'category is required' })
  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'category must be a valid id' })
  category: string;

  @IsOptional()
  @IsString({ message: 'subcategory must be a string' })
  @IsNotEmpty({ message: 'subcategory must be not empty' })
  @IsMongoId({ message: 'subcategory must be a valid id' })
  subCategory: string;

  @IsOptional()
  @IsString({ message: 'brand must be a string' })
  @IsNotEmpty({ message: 'brand must be not empty' })
  @IsMongoId({ message: 'brand must be a valid id' })
  brand: string;
}
