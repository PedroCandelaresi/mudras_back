import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RolAdminModel {
  @Field()
  id!: string;

  @Field()
  nombre!: string;

  @Field()
  slug!: string;
}
