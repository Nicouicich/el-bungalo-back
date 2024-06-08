import { hashPassword } from '@libs/utils/hash-password';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from '../cart/cart.entity';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => ID, { description: 'Unique id of the user' })
  id: string;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @Index()
  @Field(() => String, { description: 'Unique username of the user' })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Name of the user' })
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Last name of the user' })
  lastName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date, { description: 'Date when the user was created' })
  createdAt: Date;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password too weak',
  })
  @Field(() => String)
  password: string;

  @Column({ default: false })
  @Field(() => Boolean, {
    description: 'Flag indicating if the user is an admin',
  })
  admin: boolean;

  @Field(() => Cart, { nullable: true })
  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  @JoinColumn()
  cart: Cart;

  @Field(() => [Cart])
  @OneToMany(() => Cart, (cart) => cart.user)
  cartsHistory: Cart[];

  @Column({ default: false })
  @Field(() => Boolean, {
    description: 'Flag indicating if the user is enabled',
  })
  enabled: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashPassword(this.password);
  }
}
