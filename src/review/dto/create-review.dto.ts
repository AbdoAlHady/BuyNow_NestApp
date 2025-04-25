import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
    
    @IsOptional()
    @IsNotEmpty({message: 'user id is required'})
    @IsString({message: 'user id must be a string'})
    @IsMongoId({message: 'user id must be a valid mongo id'})
    user:string;

    @IsNotEmpty({message: 'product id is required'})
    @IsString({message: 'product id must be a string'})
    @IsMongoId({message: 'product id must be a valid mongo id'})
    product:string;
    
    @IsOptional()
    @IsNotEmpty({message: 'review text is required'})
    @IsString({message: 'review text must be a string'})
    @MinLength(3, {message: 'review text must be at least 3 characters long'})
    reviewText:string;
    
    @IsNotEmpty({message: 'rating is required'})
    @IsNumber({}, {message: 'rating must be a number'})
    @Min(1, {message: 'rating must be at least 1'})
    @Max(5, {message: 'rating must be at most 5'})
    rating: number;

}
