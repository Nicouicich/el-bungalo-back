import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ArrayUnique,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInputDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Name of the product' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Number, { description: 'Price of the product' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Number, { description: 'Stock quantity of the product' })
  stock: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Category of the product' })
  category: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Brand of the product' })
  brand: string;

  @ArrayUnique()
  @Field(() => [String], {
    description: 'Tags associated with the product',
    nullable: true,
  })
  tags?: string[];
}
