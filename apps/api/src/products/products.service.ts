import { CreateProductInputDto } from '@libs/dto/product/create-product-input.dto';
import { Product } from '@libs/entities/product/product.entity';
import { ProductAlreadyExistsException } from '@libs/errors/duplicated-product.error';
import { ProductNotFoundException } from '@libs/errors/not-found-product.error';
import { DUPLICATED_ERROR } from '@libs/utils/postgres-errors';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(product: CreateProductInputDto): Promise<Product> {
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === DUPLICATED_ERROR) {
        throw new ProductAlreadyExistsException(
          `${product.name} ${product.brand}`,
        );
      }
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOneById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }

  async findByName(name: string): Promise<Product[]> {
    return await this.productRepository.find({ where: { name } });
  }

  async findByNameAndBrand(name: string, brand: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { name, brand } });
  }

  async deleteOneById(id: number): Promise<boolean> {
    const deleted = await this.productRepository.delete(id);
    return Boolean(deleted?.affected);
  }

  async deleteOneByNameAndBrand(name: string, brand: string): Promise<boolean> {
    const deleted = await this.productRepository.delete({ name, brand });
    return Boolean(deleted?.affected);
  }

  async updateOneById(
    id: number,
    product: CreateProductInputDto,
  ): Promise<boolean> {
    const updated = await this.productRepository.update(id, product);
    return Boolean(updated?.affected);
  }
}
