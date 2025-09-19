import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, Index } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { PuntoMudras } from './punto-mudras.entity';

@ObjectType('StockPuntoMudras')
@Entity('stock_puntos_mudras')
@Index(['puntoMudrasId', 'articuloId'], { unique: true })
export class StockPuntoMudras {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ name: 'punto_mudras_id' })
  puntoMudrasId: number;

  @Field(() => Int)
  @Column({ name: 'articulo_id' })
  articuloId: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidad: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'stock_minimo' })
  stockMinimo: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'stock_maximo' })
  stockMaximo?: number;

  @Field()
  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  // Relaciones
  @Field(() => PuntoMudras)
  @ManyToOne(() => PuntoMudras, punto => punto.stock)
  @JoinColumn({ name: 'punto_mudras_id' })
  puntoMudras: PuntoMudras;

  // Campo virtual para artículo (se resuelve en el resolver)
  articulo?: any;

  // Campos calculados
  @Field({ nullable: true })
  estadoStock?: string; // 'OK', 'BAJO', 'SIN_STOCK'
}
