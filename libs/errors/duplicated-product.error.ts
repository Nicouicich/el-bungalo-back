export class ProductAlreadyExistsException extends Error {
  constructor(value: string) {
    super(`El producto: ${value} ya existe`);
  }
}
