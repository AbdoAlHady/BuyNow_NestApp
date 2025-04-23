import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateRequestProductDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @Length(3, 50, { message: 'Title must be between 3 and 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'Details is required' })
  @IsString({ message: 'Details must be a string' })
  @Length(5, 250, { message: 'Details must be between 5 and 255 characters' })
  details: string;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;
  
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsOptional()
  @IsString({ message: 'user must be a string' })
  @IsMongoId({ message: 'user must be a valid MongoDB ObjectId' })
  user: string;
}
