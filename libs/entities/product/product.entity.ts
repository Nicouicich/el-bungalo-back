import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@ObjectType()
@Entity()
@Unique(['name', 'brand'])
@Index(['name', 'brand'])
export class Product {
  @PrimaryGeneratedColumn('increment')
  @Index()
  @Field(() => ID, { description: 'Unique id of the product' })
  id: number;

  @Index()
  @Column()
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Name of the product' })
  name: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Number, { description: 'Price of the product' })
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  @IsPositive()
  @Field(() => Number, { description: 'Discount of the product' })
  discount: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Field(() => Number, { description: 'Stock quantity of the product' })
  stock: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Category of the product' })
  category: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { description: 'Brand of the product' })
  brand: string;

  @Column('text', { array: true, default: [] })
  @Field(() => [String], { description: 'Tags associated with the product' })
  tags: string[];
}
