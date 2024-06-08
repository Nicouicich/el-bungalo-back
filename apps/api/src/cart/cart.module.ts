import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { cartProviders } from '@libs/entities/cart/cart.provider';
import { DatabaseModule } from '@libs/db/db-connection/db-connection.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [DatabaseModule, ProductsModule],
  providers: [CartService, CartResolver, ...cartProviders],
  exports: [CartService],
})
export class CartModule {}
