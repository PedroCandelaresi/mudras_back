import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('tbrubros')
export class Rubro {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  Id: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  Rubro: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  Codigo: string;


  // Relaciones eliminadas ya que no hay campo rubroId en Articulo
}
