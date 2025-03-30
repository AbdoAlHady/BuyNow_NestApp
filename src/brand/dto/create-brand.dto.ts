import { IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @MinLength(3, { message: 'Brand name must be at least 3 characters' })
  @MaxLength(100, { message: 'Brand name must be 100 characters' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL' })
  image: string;
}
