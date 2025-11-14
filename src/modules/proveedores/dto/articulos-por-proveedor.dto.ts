import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ArticuloProveedor {
  @Field(() => Int)
  Id: number;

  @Field({ nullable: true })
  Codigo?: string;

  @Field()
  Descripcion: string;

  @Field(() => Int, { nullable: true })
  Stock?: number;

  @Field(() => Int, { nullable: true })
  PrecioVenta?: number;

  @Field({ nullable: true })
  Rubro?: string;

  @Field(() => Int, { nullable: true })
  StockMinimo?: number;

  @Field(() => Boolean, { nullable: true })
  EnPromocion?: boolean;

  @Field(() => Int)
  stock: number;

  @Field(() => Int)
  precio: number;

  @Field()
  rubro: string;
}

@ObjectType()
export class ArticulosPorProveedorResponse {
  @Field(() => [ArticuloProveedor])
  articulos: ArticuloProveedor[];

  @Field(() => Int)
  total: number;
}
