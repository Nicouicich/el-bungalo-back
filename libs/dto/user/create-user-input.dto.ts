import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInputDto {
  @Field(() => String, { description: 'Unique username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String, { description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String, { description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field(() => String, { description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial',
    },
  )
  password: string;
}
