import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User as UserEntity } from '../../../../libs/entities/user/user.entity';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserInputDto } from '@libs/dto/user/create-user-input.dto';
import { UpdateUserInputDto } from '@libs/dto/user/update-user-input.dto';
import {
  EmailAlreadyExistsInterceptor,
  UsernameAlreadyExistsInterceptor,
} from '@libs/interceptors/auth/duplicated-user.interceptor';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserEntity)
  @UseInterceptors(
    EmailAlreadyExistsInterceptor,
    UsernameAlreadyExistsInterceptor,
  )
  createUser(@Args('createUserInput') createUserInput: CreateUserInputDto) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserEntity], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  // @Query(() => UserEntity, { name: 'user' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.findOne(id);
  // }

  @Mutation(() => UserEntity)
  updateUser(@Args('updateUserInput') updateUserInputDto: UpdateUserInputDto) {
    // return this.usersService.update(updateUserInputDto.id, updateUserInputDto);
  }

  @Mutation(() => UserEntity)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
