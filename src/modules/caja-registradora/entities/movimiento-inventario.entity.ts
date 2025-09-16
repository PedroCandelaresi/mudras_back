import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { PuestoVenta } from './puesto-venta.entity';
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
@Index(['puestoVentaId'])
@Index(['tipoMovimiento'])
@Index(['fecha'])
@Index(['usuarioId'])
@Index(['ventaCajaId'])
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  articuloId: number;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articuloId' })
  @Field(() => Articulo)
  articulo: Articulo;

  @Column({ nullable: true })
  puestoVentaId?: number;

  @ManyToOne(() => PuestoVenta, { nullable: true })
  @JoinColumn({ name: 'puestoVentaId' })
  @Field(() => PuestoVenta, { nullable: true })
  puestoVenta?: PuestoVenta;

  @Column({
    type: 'enum',
    enum: TipoMovimientoInventario,
  })
  @Field(() => TipoMovimientoInventario)
  tipoMovimiento: TipoMovimientoInventario;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  cantidad: number; // Positivo para entradas, negativo para salidas

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockAnterior: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockNuevo: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field({ nullable: true })
  costoUnitario?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field({ nullable: true })
  precioVenta?: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column({ nullable: true })
  ventaCajaId?: number;

  @ManyToOne(() => VentaCaja, { nullable: true })
  @JoinColumn({ name: 'ventaCajaId' })
  @Field(() => VentaCaja, { nullable: true })
  ventaCaja?: VentaCaja;

  @Column({ type: 'datetime' })
  @Field()
  fecha: Date;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  @Field(() => Usuario)
  usuario: Usuario;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
}
