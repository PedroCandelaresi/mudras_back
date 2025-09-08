import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CrearPromocionInput } from './crear-promocion.input';
import { IsUUID } from 'class-validator';

@InputType()
export class ActualizarPromocionInput extends PartialType(CrearPromocionInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
