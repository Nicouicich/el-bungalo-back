export class ProductNotFoundException extends Error {
  constructor(value: number) {
    super(`El producto con id: ${value} no existe`);
  }
}
