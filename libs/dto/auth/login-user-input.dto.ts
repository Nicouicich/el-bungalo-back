import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserInputDto {
  @Field()
  username: string;
  @Field()
  password: string;
}
