import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { CategoriaGasto } from './categoria-gasto.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';

@ObjectType()
@Entity('tbgastos')
export class Gasto {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'date' })
  fecha: Date;

  @Field(() => Float)
  @Column({ type: 'float' })
  montoNeto: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  alicuotaIva?: number; // 10.5 o 21

  @Field(() => Float)
  @Column({ type: 'float', default: 0 })
  montoIva: number;

  @Field(() => Float)
  @Column({ type: 'float' })
  total: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion?: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  proveedorId?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  categoriaId?: number;

  @Field(() => Proveedor, { nullable: true })
  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'proveedorId' })
  proveedor?: Proveedor;

  @Field(() => CategoriaGasto, { nullable: true })
  @ManyToOne(() => CategoriaGasto, (c) => c.gastos)
  @JoinColumn({ name: 'categoriaId' })
  categoria?: CategoriaGasto;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  creadoEn: Date;
}

