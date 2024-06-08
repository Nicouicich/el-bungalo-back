export class UsernameAlreadyExistsException extends Error {
  constructor(value: string) {
    super(`El nombre de usuario: ${value} ya existe`);
  }
}

export class EmailAlreadyExistsException extends Error {
  constructor(value: string) {
    super(`El email: ${value} ya existe`);
  }
}
