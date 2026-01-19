import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql';
import { PuntoMudras } from './punto-mudras.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoMovimientoStockPunto {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
  TRANSFERENCIA = 'transferencia',
  AJUSTE = 'ajuste',
  VENTA = 'venta',
  DEVOLUCION = 'devolucion'
}

registerEnumType(TipoMovimientoStockPunto, {
  name: 'TipoMovimientoStockPunto',
  description: 'Tipo de movimiento de stock entre puntos'
});

@ObjectType('MovimientoStockPunto')
@Entity('movimientos_stock_puntos')
export class MovimientoStockPunto {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'punto_mudras_origen_id', nullable: true })
  puntoMudrasOrigenId?: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'punto_mudras_destino_id', nullable: true })
  puntoMudrasDestinoId?: number;

  @Field(() => Int)
  @Column({ name: 'articulo_id' })
  articuloId: number;

  @Field(() => TipoMovimientoStockPunto)
  @Column({
    type: 'enum',
    enum: TipoMovimientoStockPunto,
    name: 'tipo_movimiento'
  })
  tipoMovimiento: TipoMovimientoStockPunto;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cantidad_anterior' })
  cantidadAnterior?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cantidad_nueva' })
  cantidadNueva?: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  motivo?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'referencia_externa' })
  referenciaExterna?: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'usuario_id', nullable: true })
  usuarioId?: number;

  @Field()
  @CreateDateColumn({ name: 'fecha_movimiento' })
  fechaMovimiento: Date;

  // Relaciones
  @Field(() => PuntoMudras, { nullable: true })
  @ManyToOne(() => PuntoMudras, punto => punto.movimientosOrigen, { nullable: true })
  @JoinColumn({ name: 'punto_mudras_origen_id' })
  puntoOrigen?: PuntoMudras;

  @Field(() => PuntoMudras, { nullable: true })
  @ManyToOne(() => PuntoMudras, punto => punto.movimientosDestino, { nullable: true })
  @JoinColumn({ name: 'punto_mudras_destino_id' })
  puntoDestino?: PuntoMudras;

  @Field(() => Articulo, { nullable: true })
  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articulo_id' })
  articulo?: Articulo;

  @Field(() => Usuario, { nullable: true })
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario?: Usuario;


}
