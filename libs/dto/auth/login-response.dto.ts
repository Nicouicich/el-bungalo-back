import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponseDto {
  @Field()
  access_token: string;
}
