import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class NewItemCartInputDto {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => ID)
  cartId: number;
}
