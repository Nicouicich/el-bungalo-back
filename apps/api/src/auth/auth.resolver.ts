import {
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LoginResponseDto } from '@libs/dto/auth/login-response.dto';
import { IRequest } from '@libs/interfaces/express-user';
import { LoginUserInputDto } from '@libs/dto/auth/login-user-input.dto';
import { User } from '@libs/entities/user/user.entity';
import { CreateUserInputDto } from '@libs/dto/user/create-user-input.dto';
import {
  EmailAlreadyExistsInterceptor,
  UsernameAlreadyExistsInterceptor,
} from '@libs/interceptors/auth/duplicated-user.interceptor';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Mutation(() => LoginResponseDto)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInputDto,
    @Context() context: { req: IRequest; res: Response },
  ) {
    return this.authService.signJwt(context.req?.user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Mutation(() => User)
  @UseInterceptors(
    EmailAlreadyExistsInterceptor,
    UsernameAlreadyExistsInterceptor,
  )
  signUp(@Args('createUserInput') createUserInput: CreateUserInputDto) {
    return this.authService.signUp(createUserInput);
  }
}
