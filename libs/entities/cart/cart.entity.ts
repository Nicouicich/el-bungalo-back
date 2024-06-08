import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CartItem } from './cart-item.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Cart {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.cartsHistory)
  @Index()
  user: User;

  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  products: CartItem[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(user: User) {
    this.user = user;
  }
}
