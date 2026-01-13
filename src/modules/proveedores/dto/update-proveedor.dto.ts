import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateProveedorInput } from './create-proveedor.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateProveedorInput extends PartialType(CreateProveedorInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  IdProveedor: number;

  @Field(() => [Int], { nullable: true })
  @IsInt({ each: true })
  rubrosIds?: number[];
}
