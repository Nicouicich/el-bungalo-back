import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreateProductInputDto } from '@libs/dto/product/create-product-input.dto';
import { Product } from '@libs/entities/product/product.entity';
import { ProductAlreadyExistsInterceptor } from '@libs/interceptors/products/duplicated-product.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { ProductNotFoundInterceptor } from '@libs/interceptors/products/not-found-product.interceptor';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @UseInterceptors(ProductAlreadyExistsInterceptor)
  async createProduct(
    @Args('product') product: CreateProductInputDto,
  ): Promise<Product> {
    return this.productsService.createProduct(product);
  }

  @Query(() => [Product])
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product)
  @UseInterceptors(ProductNotFoundInterceptor)
  async findOneById(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Product> {
    return this.productsService.findOneById(id);
  }

  @Query(() => [Product])
  async findByName(@Args('name') name: string): Promise<Product[]> {
    return this.productsService.findByName(name);
  }

  @Query(() => Product)
  async findByNameAndBrand(
    @Args('name') name: string,
    @Args('brand') brand: string,
  ): Promise<Product> {
    return this.productsService.findByNameAndBrand(name, brand);
  }

  @Mutation(() => Boolean)
  async deleteOneById(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<boolean> {
    return await this.productsService.deleteOneById(id);
  }

  @Mutation(() => Boolean)
  async deleteOneByNameAndBrand(
    @Args('name') name: string,
    @Args('brand') brand: string,
  ): Promise<boolean> {
    return await this.productsService.deleteOneByNameAndBrand(name, brand);
  }

  @Mutation(() => Boolean)
  async updateOneById(
    @Args('id', { type: () => Number }) id: number,
    @Args('product', { type: () => CreateProductInputDto })
    product: CreateProductInputDto,
  ): Promise<boolean> {
    return await this.productsService.updateOneById(id, product);
  }
}
