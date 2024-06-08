import { NewItemCartInputDto } from '@libs/dto/cart/new-item-cart.dto';
import { CartItem } from '@libs/entities/cart/cart-item.entity';
import { Cart } from '@libs/entities/cart/cart.entity';
import { User } from '@libs/entities/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_REPOSITORY')
    private cartRepository: Repository<Cart>,
    @Inject('CART_ITEM_REPOSITORY')
    private cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductsService,
  ) {}

  async createCart(user: User) {
    const cart = new Cart(user);
    return await this.cartRepository.save(cart);
  }

  async getCartById(id: number) {
    return await this.cartRepository.findOne({ where: { id } });
  }

  async addITemToCart(item: NewItemCartInputDto): Promise<boolean> {
    try {
      const product = await this.productService.findOneById(item.productId);
      if (!product) return false;

      let cartItem: CartItem = await this.cartItemRepository.findOne({
        where: { productId: item.productId, cart: { id: item.cartId } },
      });
      if (cartItem) {
        cartItem.quantity += item.quantity;
      } else {
        cartItem = new CartItem();
        cartItem.productId = item.productId;
        cartItem.quantity = item.quantity;
        cartItem.price = product.price;
        cartItem.cart = { id: item.cartId } as Cart;
      }

      await this.cartItemRepository.save(cartItem);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getCart(id: number): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
