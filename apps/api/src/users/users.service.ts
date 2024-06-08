import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserInputDto } from '@libs/dto/user/update-user-input.dto';
import { CreateUserInputDto } from '@libs/dto/user/create-user-input.dto';
import { Repository } from 'typeorm';
import { User } from '../../../../libs/entities/user/user.entity';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from '@libs/errors/duplicated-user.error';
import { DUPLICATED_ERROR } from '@libs/utils/postgres-errors';
import { CartService } from '../cart/cart.service';
import { Cart } from '@libs/entities/cart/cart.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly cartService: CartService,
  ) {}

  async create(createUserInput: CreateUserInputDto): Promise<User> {
    const newUser: User = this.userRepository.create(createUserInput);
    try {
      const user = await this.userRepository.save(newUser);
      const cart: Cart = await this.cartService.createCart(newUser);
      newUser.cart = cart;
      await this.userRepository.save(newUser);

      return user;
    } catch (error) {
      if (
        error?.code === DUPLICATED_ERROR &&
        error?.detail?.includes('username')
      )
        throw new UsernameAlreadyExistsException(createUserInput?.username);

      if (error?.code === DUPLICATED_ERROR && error?.detail?.includes('email'))
        throw new EmailAlreadyExistsException(createUserInput.email);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  update(id: number, updateUserInput: UpdateUserInputDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
