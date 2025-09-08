import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import { EstadoPromocion } from '../entities/promocion.entity';

@InputType()
export class CrearPromocionInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 120)
  nombre: string;

  @Field()
  @IsDateString()
  inicio: string;

  @Field()
  @IsDateString()
  fin: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(EstadoPromocion)
  estado?: EstadoPromocion;

  @Field()
  @IsInt()
  @Min(0)
  @Max(100)
  descuento: number;
}
