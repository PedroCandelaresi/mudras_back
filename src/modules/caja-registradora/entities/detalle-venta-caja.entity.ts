import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { VentaCaja } from './venta-caja.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('detalles_venta_caja')
@ObjectType()
@Index(['ventaId'])
@Index(['articuloId'])
export class DetalleVentaCaja {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ name: 'venta_id' })
  ventaId: number;

  @ManyToOne(() => VentaCaja, venta => venta.detalles)
  @JoinColumn({ name: 'venta_id' })
  @Field(() => VentaCaja)
  venta: VentaCaja;

  @Column({ name: 'articulo_id' })
  articuloId: number;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articulo_id' })
  @Field(() => Articulo)
  articulo: Articulo;

  @Column({ name: 'cantidad', type: 'decimal', precision: 10, scale: 3 })
  @Field()
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 12, scale: 2 })
  @Field()
  precioUnitario: number;

  @Column({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field()
  descuentoPorcentaje: number;

  @Column({ name: 'descuento_monto', type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  descuentoMonto: number;

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 })
  @Field()
  subtotal: number;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  creadoEn: Date;
}
