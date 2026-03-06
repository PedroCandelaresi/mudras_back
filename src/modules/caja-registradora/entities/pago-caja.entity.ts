import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { VentaCaja } from './venta-caja.entity';

export enum MedioPagoCaja {
  EFECTIVO = 'efectivo',
  DEBITO = 'debito',
  CREDITO = 'credito',
  TRANSFERENCIA = 'transferencia',
  QR = 'qr',
  CUENTA_CORRIENTE = 'cuenta_corriente',
}

export enum SubmedioPagoCaja {
  QR_MODO = 'qr_modo',
  QR_MERCADOPAGO = 'qr_mercadopago',
}

registerEnumType(MedioPagoCaja, {
  name: 'MedioPagoCaja',
  description: 'Medios de pago disponibles en caja',
});

registerEnumType(SubmedioPagoCaja, {
  name: 'SubmedioPagoCaja',
  description: 'Submedios de pago para variantes de QR',
});

@Entity('pagos_caja')
@ObjectType()
@Index(['ventaId'])
@Index(['medioPago'])
@Index(['submedioPago'])
export class PagoCaja {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ name: 'venta_id' })
  ventaId: number;

  @ManyToOne(() => VentaCaja, venta => venta.pagos)
  @JoinColumn({ name: 'venta_id' })
  @Field(() => VentaCaja)
  venta: VentaCaja;

  @Column({
    name: 'metodo_pago',
    type: 'enum',
    enum: MedioPagoCaja,
  })
  @Field(() => MedioPagoCaja)
  medioPago: MedioPagoCaja;

  @Column({
    name: 'submedio_pago',
    type: 'enum',
    enum: SubmedioPagoCaja,
    nullable: true,
  })
  @Field(() => SubmedioPagoCaja, { nullable: true })
  submedioPago?: SubmedioPagoCaja;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  monto: number;

  @Column({ name: 'tipo_tarjeta', length: 50, nullable: true })
  @Field({ nullable: true })
  marcaTarjeta?: string; // Visa, Mastercard, etc.

  @Column({ name: 'numero_tarjeta_ultimos_4', length: 4, nullable: true })
  @Field({ nullable: true })
  ultimos4Digitos?: string;

  @Column({ name: 'numero_cuotas', type: 'int', nullable: true })
  @Field({ nullable: true })
  cuotas?: number;

  @Column({ name: 'referencia', length: 100, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  creadoEn: Date;
}
