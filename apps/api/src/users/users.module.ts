import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { DatabaseModule } from 'libs/db/db-connection/db-connection.module';
import { userProviders } from '@libs/entities/user/user.provider';
import { CartService } from '../cart/cart.service';
import { CartModule } from '../cart/cart.module';
import { cartProviders } from '@libs/entities/cart/cart.provider';

@Module({
  imports: [DatabaseModule, CartModule],
  providers: [UsersResolver, UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
