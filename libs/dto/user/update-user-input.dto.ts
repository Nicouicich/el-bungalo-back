import { Field, InputType, PartialType } from '@nestjs/graphql';
import { User } from '../../entities/user/user.entity';

@InputType()
export class UpdateUserInputDto extends PartialType(User) {
  @Field(() => String)
  username: string;
}
