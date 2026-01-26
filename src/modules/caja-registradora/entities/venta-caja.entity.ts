import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { UserAuth } from '../../users-auth/entities/user.entity';
import { PuntoMudras } from '../../puntos-mudras/entities/punto-mudras.entity';
import { DetalleVentaCaja } from './detalle-venta-caja.entity';
import { PagoCaja } from './pago-caja.entity';
import { ComprobanteAfip } from './comprobante-afip.entity';

export enum TipoVentaCaja {
  MOSTRADOR = 'mostrador',
  ONLINE = 'online',
  MAYORISTA = 'mayorista',
  TELEFONICA = 'telefonica',
  DELIVERY = 'delivery',
}

registerEnumType(TipoVentaCaja, {
  name: 'TipoVentaCaja',
  description: 'Tipos de venta en caja registradora',
});

export enum EstadoVentaCaja {
  BORRADOR = 'borrador',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  DEVUELTA = 'devuelta',
  DEVUELTA_PARCIAL = 'devuelta_parcial',
}

registerEnumType(EstadoVentaCaja, {
  name: 'EstadoVentaCaja',
  description: 'Estados de venta en caja',
});

@Entity('ventas_caja')
@ObjectType()

@Index(['clienteId'])
@Index(['usuarioAuthId'])
@Index(['estado'])
@Index(['fecha'])
@Index(['tipoVenta'])
export class VentaCaja {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ name: 'numero_venta', length: 20, unique: true })
  @Field()
  numeroVenta: string;

  @Column({ name: 'fecha', type: 'datetime' })
  @Field()
  fecha: Date;

  @Column({
    name: 'tipo_venta',
    type: 'enum',
    enum: TipoVentaCaja,
  })
  @Field(() => TipoVentaCaja)
  tipoVenta: TipoVentaCaja;

  @Column({
    name: 'estado',
    type: 'enum',
    enum: EstadoVentaCaja,
    default: EstadoVentaCaja.BORRADOR,
  })
  @Field(() => EstadoVentaCaja)
  estado: EstadoVentaCaja;

  // Nuevo origen de venta: Punto Mudras de tipo 'venta'
  @Column({ name: 'punto_mudras_id' })
  @Field(() => Number)
  puntoMudrasId: number;

  @ManyToOne(() => PuntoMudras)
  @JoinColumn({ name: 'punto_mudras_id' })
  @Field(() => PuntoMudras)
  puntoMudras: PuntoMudras;

  @Column({ name: 'cliente_id', nullable: true })
  clienteId?: number | null;

  @ManyToOne(() => Cliente, cliente => cliente.ventas, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  @Field(() => Cliente, { nullable: true })
  cliente?: Cliente | null;

  @Column({ name: 'usuarioAuthId', type: 'char', length: 36 })
  @Field()
  usuarioAuthId: string;

  @ManyToOne(() => UserAuth)
  @JoinColumn({ name: 'usuarioAuthId' })
  @Field(() => UserAuth)
  usuarioAuth: UserAuth;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  subtotal: number;

  @Column({ name: 'descuento_porcentaje', type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field()
  descuentoPorcentaje: number;

  @Column({ name: 'descuento_monto', type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  descuentoMonto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  impuestos: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  total: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  cambio: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @Column({ name: 'venta_original_id', nullable: true })
  @Field({ nullable: true })
  ventaOriginalId?: number; // Para devoluciones

  @ManyToOne(() => VentaCaja, { nullable: true })
  @JoinColumn({ name: 'venta_original_id' })
  @Field(() => VentaCaja, { nullable: true })
  ventaOriginal?: VentaCaja;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  creadoEn: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  actualizadoEn: Date;

  // Relaciones
  @OneToMany(() => DetalleVentaCaja, detalle => detalle.venta)
  @Field(() => [DetalleVentaCaja], { nullable: true })
  detalles?: DetalleVentaCaja[];

  @OneToMany(() => PagoCaja, pago => pago.venta)
  @Field(() => [PagoCaja], { nullable: true })
  pagos?: PagoCaja[];

  @OneToMany(() => ComprobanteAfip, comprobante => comprobante.venta, { nullable: true })
  @Field(() => [ComprobanteAfip], { nullable: true })
  comprobantesAfip?: ComprobanteAfip[];
}
