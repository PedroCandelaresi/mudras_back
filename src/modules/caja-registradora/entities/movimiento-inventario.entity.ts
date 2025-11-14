import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { UserAuth } from '../../users-auth/entities/user.entity';
import { PuntoMudras } from '../../puntos-mudras/entities/punto-mudras.entity';
import { VentaCaja } from './venta-caja.entity';

export enum TipoMovimientoInventario {
  VENTA = 'venta',
  DEVOLUCION = 'devolucion',
  AJUSTE_POSITIVO = 'ajuste_positivo',
  AJUSTE_NEGATIVO = 'ajuste_negativo',
  TRANSFERENCIA_ENTRADA = 'transferencia_entrada',
  TRANSFERENCIA_SALIDA = 'transferencia_salida',
  COMPRA = 'compra',
  ROTURA = 'rotura',
  VENCIMIENTO = 'vencimiento',
  INVENTARIO_INICIAL = 'inventario_inicial',
}

registerEnumType(TipoMovimientoInventario, {
  name: 'TipoMovimientoInventario',
  description: 'Tipos de movimientos de inventario para caja registradora',
});

@Entity('movimientos_inventario')
@ObjectType()
@Index(['articuloId'])
@Index(['tipoMovimiento'])
@Index(['fecha'])
@Index(['usuarioAuthId'])
@Index(['ventaCajaId'])
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ name: 'articulo_id' })
  articuloId: number;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articulo_id' })
  @Field(() => Articulo)
  articulo: Articulo;

  // Origen en punto Mudras (venta)
  @Column({ name: 'punto_mudras_id', nullable: true })
  puntoMudrasId?: number | null;

  @ManyToOne(() => PuntoMudras, { nullable: true })
  @JoinColumn({ name: 'punto_mudras_id' })
  @Field(() => PuntoMudras, { nullable: true })
  puntoMudras?: PuntoMudras | null;

  @Column({
    name: 'tipo_movimiento',
    type: 'enum',
    enum: TipoMovimientoInventario,
  })
  @Field(() => TipoMovimientoInventario)
  tipoMovimiento: TipoMovimientoInventario;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  cantidad: number; // Positivo para entradas, negativo para salidas

  // Columnas de stock anterior/nuevo y costo no existen en la tabla actual,
  // por lo que se omiten en el mapeo de la entidad.

  @Column({ name: 'precio_venta', type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field({ nullable: true })
  precioVenta?: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @Column({ name: 'numero_comprobante', length: 50, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column({ name: 'venta_caja_id', nullable: true })
  ventaCajaId?: number;

  @ManyToOne(() => VentaCaja, { nullable: true })
  @JoinColumn({ name: 'venta_caja_id' })
  @Field(() => VentaCaja, { nullable: true })
  ventaCaja?: VentaCaja;

  @Column({ name: 'fecha', type: 'datetime' })
  @Field()
  fecha: Date;

  @Column({ name: 'usuarioAuthId', type: 'char', length: 36 })
  @Field()
  usuarioAuthId: string;

  @ManyToOne(() => UserAuth)
  @JoinColumn({ name: 'usuarioAuthId' })
  usuarioAuth: UserAuth;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  creadoEn: Date;
}
