import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class CrearOrdenCompraDto {
  @Field(() => Int)
  @IsInt()
  proveedorId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

