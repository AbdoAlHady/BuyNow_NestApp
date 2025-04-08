import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class CreateSupplierDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    @Length(3, 50, {message: 'Name must be between 3 and 50 characters'})
    name:string;

    @IsNotEmpty({message: 'Email is required'})
    @IsUrl({}, {message: 'Email must be a valid URL'})
    website:string;

}
