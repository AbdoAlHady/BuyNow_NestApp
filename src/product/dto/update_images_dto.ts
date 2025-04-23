import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpdateImagesDto {
  @IsOptional()
  @IsUrl({ require_tld: false }, {  message: 'images must be valid URLs' })
  @IsNotEmpty({ message: 'old image must be not empty' })
  oldImage: string;
}
