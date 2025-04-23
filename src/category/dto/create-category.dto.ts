import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @MinLength(3, { message: 'Category name must be at least 3 characters' })
  @MaxLength(30, { message: 'Category name must be 30 characters' })
  name: string;
  
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL' })
  image: string;
}
