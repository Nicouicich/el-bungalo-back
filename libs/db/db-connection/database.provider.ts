import { CartItem } from '@libs/entities/cart/cart-item.entity';
import { Cart } from '@libs/entities/cart/cart.entity';
import { Product } from '@libs/entities/product/product.entity';
import { User } from '@libs/entities/user/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin',
        database: 'postgres',
        entities: [User, Product, Cart, CartItem],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
