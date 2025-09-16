import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { PuestoVenta } from './puesto-venta.entity';
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
@Index(['numeroVenta'], { unique: true })
@Index(['clienteId'])
@Index(['usuarioId'])
@Index(['puestoVentaId'])
@Index(['estado'])
@Index(['fecha'])
@Index(['tipoVenta'])
export class VentaCaja {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 20, unique: true })
  @Field()
  numeroVenta: string;

  @Column({ type: 'datetime' })
  @Field()
  fecha: Date;

  @Column({
    type: 'enum',
    enum: TipoVentaCaja,
  })
  @Field(() => TipoVentaCaja)
  tipoVenta: TipoVentaCaja;

  @Column({
    type: 'enum',
    enum: EstadoVentaCaja,
    default: EstadoVentaCaja.BORRADOR,
  })
  @Field(() => EstadoVentaCaja)
  estado: EstadoVentaCaja;

  @Column()
  puestoVentaId: number;

  @ManyToOne(() => PuestoVenta, puesto => puesto.ventas)
  @JoinColumn({ name: 'puestoVentaId' })
  @Field(() => PuestoVenta)
  puestoVenta: PuestoVenta;

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

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field()
  descuentoPorcentaje: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
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

  @Column({ nullable: true })
  @Field({ nullable: true })
  ventaOriginalId?: number; // Para devoluciones

  @ManyToOne(() => VentaCaja, { nullable: true })
  @JoinColumn({ name: 'ventaOriginalId' })
  @Field(() => VentaCaja, { nullable: true })
  ventaOriginal?: VentaCaja;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
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
