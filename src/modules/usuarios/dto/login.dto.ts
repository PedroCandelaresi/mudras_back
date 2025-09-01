import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  usernameOrEmail: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
