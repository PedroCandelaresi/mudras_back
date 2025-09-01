import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';

export enum EstadoVenta {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada',
}

registerEnumType(EstadoVenta, {
  name: 'EstadoVenta',
  description: 'Estados de ventas',
});

export enum TipoPago {
  EFECTIVO = 'efectivo',
  TARJETA_DEBITO = 'tarjeta_debito',
  TARJETA_CREDITO = 'tarjeta_credito',
  TRANSFERENCIA = 'transferencia',
  CUENTA_CORRIENTE = 'cuenta_corriente',
  MIXTO = 'mixto',
}

registerEnumType(TipoPago, {
  name: 'TipoPago',
  description: 'Tipos de pago disponibles',
});

@Entity('ventas')
@ObjectType()
@Index(['numero'], { unique: true })
@Index(['clienteId'])
@Index(['usuarioId'])
@Index(['estado'])
@Index(['fecha'])
@Index(['tipoPago'])
export class Venta {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 20, unique: true })
  @Field()
  numero: string;

  @Column({ type: 'date' })
  @Field()
  fecha: Date;

  @Column()
  clienteId: number;

  @ManyToOne(() => Cliente, cliente => cliente.ventas)
  @JoinColumn({ name: 'clienteId' })
  @Field(() => Cliente)
  cliente: Cliente;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  @Field(() => Usuario)
  usuario: Usuario;

  @Column({
    type: 'enum',
    enum: EstadoVenta,
    default: EstadoVenta.PENDIENTE,
  })
  @Field(() => EstadoVenta)
  estado: EstadoVenta;

  @Column({
    type: 'enum',
    enum: TipoPago,
  })
  @Field(() => TipoPago)
  tipoPago: TipoPago;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field()
  descuentoPorcentaje: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  descuentoMonto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  total: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  montoEfectivo: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  montoTarjeta: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  montoTransferencia: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  montoCuentaCorriente: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  cambio: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
  @Field()
  actualizadoEn: Date;

  // Relaciones
  @OneToMany(() => DetalleVenta, detalle => detalle.venta)
  @Field(() => [DetalleVenta], { nullable: true })
  detalles?: DetalleVenta[];
}
