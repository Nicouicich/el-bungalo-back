import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { productProviders } from '@libs/entities/product/product.provider';
import { DatabaseModule } from '@libs/db/db-connection/db-connection.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProductsService, ProductsResolver, ...productProviders],
  exports: [ProductsService],
})
export class ProductsModule {}
