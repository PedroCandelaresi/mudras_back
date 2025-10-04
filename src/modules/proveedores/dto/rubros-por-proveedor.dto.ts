import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RubroPorProveedor {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  proveedorId: number;

  @Field({ nullable: true })
  proveedorNombre?: string;

  @Field(() => Int, { nullable: true })
  proveedorCodigo?: number;

  @Field({ nullable: true })
  rubroNombre?: string;

  @Field(() => Int, { nullable: true })
  rubroId?: number;

  @Field(() => Int, { nullable: true })
  cantidadArticulos?: number;
}
