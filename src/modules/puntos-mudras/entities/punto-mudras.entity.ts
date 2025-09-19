import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { StockPuntoMudras } from './stock-punto-mudras.entity';
import { MovimientoStockPunto } from './movimiento-stock-punto.entity';

export enum TipoPuntoMudras {
  venta = 'venta',
  deposito = 'deposito'
}

registerEnumType(TipoPuntoMudras, {
  name: 'TipoPuntoMudras',
  description: 'Tipo de punto Mudras: venta o depósito'
});

@ObjectType('PuntoMudras')
@Entity('puntos_mudras')
export class PuntoMudras {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Field(() => TipoPuntoMudras)
  @Column({
    type: 'enum',
    enum: TipoPuntoMudras
  })
  tipo: TipoPuntoMudras;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Field()
  @Column({ type: 'boolean', default: false, name: 'permite_ventas_online' })
  permiteVentasOnline: boolean;

  @Field()
  @Column({ type: 'boolean', default: true, name: 'maneja_stock_fisico' })
  manejaStockFisico: boolean;

  @Field()
  @Column({ type: 'boolean', default: false, name: 'requiere_autorizacion' })
  requiereAutorizacion: boolean;

  @Field()
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Field()
  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  // Relaciones
  @Field(() => [StockPuntoMudras], { nullable: true })
  @OneToMany(() => StockPuntoMudras, stock => stock.puntoMudras)
  stock?: StockPuntoMudras[];

  @Field(() => [MovimientoStockPunto], { nullable: true })
  @OneToMany(() => MovimientoStockPunto, movimiento => movimiento.puntoOrigen)
  movimientosOrigen?: MovimientoStockPunto[];

  @Field(() => [MovimientoStockPunto], { nullable: true })
  @OneToMany(() => MovimientoStockPunto, movimiento => movimiento.puntoDestino)
  movimientosDestino?: MovimientoStockPunto[];

  // Campos calculados
  @Field(() => Int, { nullable: true })
  totalArticulos?: number;

  @Field({ nullable: true })
  valorInventario?: number;
}
