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

  @Column()
  ventaId: number;

  @ManyToOne(() => VentaCaja, venta => venta.detalles)
  @JoinColumn({ name: 'ventaId' })
  @Field(() => VentaCaja)
  venta: VentaCaja;

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

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
}
