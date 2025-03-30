import {IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateSubcategoryDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    @Length(3, 30, {message: 'Name must be between 3 and 30 characters'})
    name: string;

    @IsNotEmpty({message: 'subCategory must belong to a Category.!'})
    @IsString({message: 'Category id must be a string',each:true})
    @IsMongoId({message: 'Invalid Category Id format.!',each:true})
    category: string;
}
