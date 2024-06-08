import { Args, Resolver, Mutation, Int, Query } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { NewItemCartInputDto } from '@libs/dto/cart/new-item-cart.dto';
import { Cart } from '@libs/entities/cart/cart.entity';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Boolean)
  async addITemToCart(
    @Args('item') item: NewItemCartInputDto,
  ): Promise<boolean> {
    return await this.cartService.addITemToCart(item);
  }

  @Query(() => Cart)
  async getCart(@Args('id', { type: () => Int }) id: number): Promise<Cart> {
    return await this.cartService.getCart(id);
  }
}
