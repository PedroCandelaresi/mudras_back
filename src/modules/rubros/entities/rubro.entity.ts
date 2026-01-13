import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';

@ObjectType()
@Entity('mudras_rubros')
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

  @Field({ nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 })
  PorcentajeRecargo: number;

  @Field({ nullable: true })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 })
  PorcentajeDescuento: number;

  // Relaciones FK
  @OneToMany(() => Articulo, articulo => articulo.rubro)
  @Field(() => [Articulo], { nullable: true })
  articulos?: Articulo[];

  @OneToMany(() => Proveedor, proveedor => proveedor.rubro)
  @Field(() => [Proveedor], { nullable: true })
  proveedores?: Proveedor[];

  @ManyToMany(() => Proveedor, (proveedor) => proveedor.rubros)
  proveedoresNuevos?: Proveedor[];
}
