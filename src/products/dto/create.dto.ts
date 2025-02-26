import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto{
    @IsString()
    name: string

    @IsString()
    category: string

    @IsNumber()
    price: number

    @IsOptional()
    @IsString()
    description?: string
}