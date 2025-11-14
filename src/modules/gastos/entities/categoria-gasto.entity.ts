import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Gasto } from './gasto.entity';

@ObjectType()
@Entity('tbcategoria_gasto')
export class CategoriaGasto {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 80 })
  nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion?: string;

  @OneToMany(() => Gasto, (g) => g.categoria)
  gastos: Gasto[];
}

