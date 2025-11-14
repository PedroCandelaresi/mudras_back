import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { OrdenCompra } from './orden-compra.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';

@ObjectType()
@Entity('tborden_compra_detalle')
export class DetalleOrdenCompra {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  ordenId: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  articuloId: number;

  @Field(() => Float)
  @Column({ type: 'float' })
  cantidad: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  precioUnitario?: number; // precio negociado en la OC

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  cantidadRecibida?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  costoUnitarioRecepcion?: number; // costo real de recepción

  @ManyToOne(() => OrdenCompra, (o) => o.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenId' })
  orden: OrdenCompra;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articuloId' })
  articulo: Articulo;
}

