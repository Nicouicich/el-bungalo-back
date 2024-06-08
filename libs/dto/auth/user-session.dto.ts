import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserSessionDto {
  @Field()
  id: string;
  @Field()
  username: string;
}
