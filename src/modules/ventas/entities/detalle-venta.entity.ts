import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Venta } from './venta.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('detalles_ventas')
@ObjectType()
@Index(['ventaId'])
@Index(['articuloId'])
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  ventaId: number;

  @ManyToOne(() => Venta, venta => venta.detalles)
  @JoinColumn({ name: 'ventaId' })
  @Field(() => Venta)
  venta: Venta;

  @Column()
  articuloId: number;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articuloId' })
  @Field(() => Articulo)
  articulo: Articulo;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  cantidad: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field()
  descuentoPorcentaje: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  descuentoMonto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  subtotal: number;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
}
