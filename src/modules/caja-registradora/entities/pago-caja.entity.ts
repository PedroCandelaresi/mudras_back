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

registerEnumType(MedioPagoCaja, {
  name: 'MedioPagoCaja',
  description: 'Medios de pago disponibles en caja',
});

@Entity('pagos_caja')
@ObjectType()
@Index(['ventaId'])
@Index(['medioPago'])
@Index(['fecha'])
export class PagoCaja {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  ventaId: number;

  @ManyToOne(() => VentaCaja, venta => venta.pagos)
  @JoinColumn({ name: 'ventaId' })
  @Field(() => VentaCaja)
  venta: VentaCaja;

  @Column({
    type: 'enum',
    enum: MedioPagoCaja,
  })
  @Field(() => MedioPagoCaja)
  medioPago: MedioPagoCaja;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  monto: number;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  marcaTarjeta?: string; // Visa, Mastercard, etc.

  @Column({ length: 4, nullable: true })
  @Field({ nullable: true })
  ultimos4Digitos?: string;

  @Column({ type: 'int', nullable: true })
  @Field({ nullable: true })
  cuotas?: number;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  numeroAutorizacion?: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @Column({ type: 'datetime' })
  @Field()
  fecha: Date;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
}
