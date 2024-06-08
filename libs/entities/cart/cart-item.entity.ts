import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Cart } from './cart.entity';

@ObjectType()
@Entity()
export class CartItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  productId: number;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => Number)
  @Column()
  price: number;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.products)
  cart: Cart;
}
