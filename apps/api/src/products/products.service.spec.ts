import { CreateProductInputDto } from '@libs/dto/product/create-product-input.dto';
import { Product } from '@libs/entities/product/product.entity';
import { ProductAlreadyExistsException } from '@libs/errors/duplicated-product.error';
import { DUPLICATED_ERROR } from '@libs/utils/postgres-errors';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let resolver: ProductsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsResolver,
        ProductsService,
        {
          provide: 'PRODUCT_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>('PRODUCT_REPOSITORY');
    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const product: CreateProductInputDto = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 10,
        stock: 100,
        category: 'Test Category',
        tags: ['tag1', 'tag2'],
      };

      const savedProduct = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 10,
        stock: 100,
        category: 'Test Category',
        tags: ['tag1', 'tag2'],
        discount: 0,
      } as Product;

      jest.spyOn(productRepository, 'save').mockResolvedValue(savedProduct);

      const result = await service.createProduct(product);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...productWithoutId } = result;
      expect(result).toEqual(productWithoutId);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw ProductAlreadyExistsException when a duplicated product is created', async () => {
      const product: CreateProductInputDto = {
        name: 'Test Product',
        brand: 'Test Brand',
        price: 10,
        stock: 100,
        category: 'Test Category',
        tags: ['tag1', 'tag2'],
      };

      const duplicatedError = { code: DUPLICATED_ERROR }; // Simulate a duplicated error

      jest.spyOn(productRepository, 'save').mockRejectedValue(duplicatedError);

      await expect(service.createProduct(product)).rejects.toThrow(
        new ProductAlreadyExistsException('Test Product Test Brand'),
      );
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products: Product[] = [
        {
          id: 1,
          name: 'Product 1',
          brand: 'Brand 1',
          price: 10,
          discount: 0,
          stock: 100,
          category: 'Category 1',
          tags: ['tag1', 'tag2'],
        },
        {
          id: 2,
          name: 'Product 2',
          brand: 'Brand 2',
          price: 20,
          discount: 0,
          stock: 200,
          category: 'Category 2',
          tags: ['tag3', 'tag4'],
        },
      ];

      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(productRepository.find).toHaveBeenCalled();
    });
  });

  describe('findByName', () => {
    it('should return products by name', async () => {
      const productName = 'Test Product';
      const products: Product[] = [
        {
          id: 1,
          name: 'Product 1',
          brand: 'Brand 1',
          price: 10,
          discount: 0,
          stock: 100,
          category: 'Category 1',
          tags: ['tag1', 'tag2'],
        },
        {
          id: 2,
          name: 'Product 2',
          brand: 'Brand 2',
          price: 20,
          discount: 0,
          stock: 200,
          category: 'Category 2',
          tags: ['tag3', 'tag4'],
        },
      ];

      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      const result: Product[] = await service.findByName(productName);

      expect(result).toEqual(products);
      expect(productRepository.find).toHaveBeenCalledWith({
        where: { name: productName },
      });
    });
  });

  describe('findByNameAndBrand', () => {
    it('should return a product by name and brand', async () => {
      const productName = 'Test Product';
      const brand = 'Test Brand';
      const product: Product = {
        id: 1,
        name: 'Product 1',
        brand: 'Brand 1',
        price: 10,
        discount: 0,
        stock: 100,
        category: 'Category 1',
        tags: ['tag1', 'tag2'],
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

      const result = await service.findByNameAndBrand(productName, brand);

      expect(result).toEqual(product);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { name: productName, brand: brand },
      });
    });
  });

  describe('deleteOneById', () => {
    it('should delete a product by id', async () => {
      const productId = 1;
      const deletedResult = { affected: 1, raw: [] };

      jest.spyOn(productRepository, 'delete').mockResolvedValue(deletedResult);

      const result = await service.deleteOneById(productId);

      expect(result).toBe(true);
      expect(productRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should return false when no product is deleted', async () => {
      const productId = 1;
      const deletedResult = { affected: 0, raw: [] };

      jest.spyOn(productRepository, 'delete').mockResolvedValue(deletedResult);

      const result = await service.deleteOneById(productId);

      expect(result).toBe(false);
      expect(productRepository.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('deleteOneByNameAndBrand', () => {
    it('should delete a product by name and brand', async () => {
      const productName = 'Test Product';
      const brand = 'Test Brand';
      const deletedResult = { affected: 1, raw: [] };

      jest.spyOn(productRepository, 'delete').mockResolvedValue(deletedResult);

      const result = await service.deleteOneByNameAndBrand(productName, brand);

      expect(result).toBe(true);
      expect(productRepository.delete).toHaveBeenCalledWith({
        name: productName,
        brand: brand,
      });
    });

    it('should return false when no product is deleted', async () => {
      const productName = 'Test Product';
      const brand = 'Test Brand';
      const deletedResult = { affected: 0, raw: [] };

      jest.spyOn(productRepository, 'delete').mockResolvedValue(deletedResult);

      const result = await service.deleteOneByNameAndBrand(productName, brand);

      expect(result).toBe(false);
      expect(productRepository.delete).toHaveBeenCalledWith({
        name: productName,
        brand: brand,
      });
    });
  });

  describe('updateOneById', () => {
    it('should update a product by id', async () => {
      const productId = 1;
      const updatedProduct: CreateProductInputDto = {
        name: 'Updated Product',
        brand: 'Updated Brand',
        price: 20,
        stock: 200,
        category: 'Updated Category',
        tags: ['tag1', 'tag2'],
      };

      const updatedResult = true;

      jest.spyOn(service, 'updateOneById').mockResolvedValue(updatedResult);

      const result = await resolver.updateOneById(productId, updatedProduct);

      expect(result).toBe(updatedResult);
      expect(service.updateOneById).toHaveBeenCalledWith(
        productId,
        updatedProduct,
      );
    });
  });
});
