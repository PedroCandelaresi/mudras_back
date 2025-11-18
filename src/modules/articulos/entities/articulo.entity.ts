import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Rubro } from '../../rubros/entities/rubro.entity';
import { MovimientoStock } from '../../stock/entities/movimiento-stock.entity';

@ObjectType()
@Entity('tbarticulos')
export class Articulo {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 20, default: 'SINCODIGO' })
  Codigo: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 25, nullable: true })
  Rubro: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Descripcion: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  Marca: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  PrecioVenta: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  PrecioCompra: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  StockMinimo: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Stock: number;

  @Field(() => Float, { nullable: true })
  totalStock?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  AlicuotaIva: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Deposito: number;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  FechaCompra: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  idProveedor: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rubroId: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Lista2: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Lista3: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  Unidad: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Lista4: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  PorcentajeGanancia: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  Calculado: boolean;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  CodigoProv: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  CostoPromedio: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  CostoEnDolares: boolean;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  FechaModif: Date;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  PrecioListaProveedor: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  StockInicial: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 6, nullable: true })
  Ubicacion: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  Lista1EnDolares: boolean;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Dto1: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Dto2: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Dto3: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Impuesto: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  EnPromocion: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  UsaTalle: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  Compuesto: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', default: 0 })
  Combustible: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'tinyint', nullable: true })
  ImpuestoPorcentual: boolean;


  // Relaciones
  @Field(() => Proveedor, { nullable: true })
  @ManyToOne(() => Proveedor, proveedor => proveedor.articulos)
  @JoinColumn({ name: 'idProveedor' })
  proveedor?: Proveedor;

  @Field(() => Rubro, { nullable: true })
  @ManyToOne(() => Rubro, rubro => rubro.articulos, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'rubroId', referencedColumnName: 'Id' })
  rubro?: Rubro;

  @OneToMany(() => MovimientoStock, movimiento => movimiento.articulo)
  @Field(() => [MovimientoStock], { nullable: true })
  movimientosStock?: MovimientoStock[];
}
