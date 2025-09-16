import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { VentaCaja } from './venta-caja.entity';

export enum TipoComprobanteAfip {
  FACTURA_A = 'factura_a',
  FACTURA_B = 'factura_b',
  FACTURA_C = 'factura_c',
  NOTA_CREDITO_A = 'nota_credito_a',
  NOTA_CREDITO_B = 'nota_credito_b',
  NOTA_CREDITO_C = 'nota_credito_c',
  NOTA_DEBITO_A = 'nota_debito_a',
  NOTA_DEBITO_B = 'nota_debito_b',
  NOTA_DEBITO_C = 'nota_debito_c',
}

registerEnumType(TipoComprobanteAfip, {
  name: 'TipoComprobanteAfip',
  description: 'Tipos de comprobantes AFIP',
});

export enum EstadoComprobanteAfip {
  PENDIENTE = 'pendiente',
  EMITIDO = 'emitido',
  ERROR = 'error',
  ANULADO = 'anulado',
}

registerEnumType(EstadoComprobanteAfip, {
  name: 'EstadoComprobanteAfip',
  description: 'Estados de comprobantes AFIP',
});

@Entity('comprobantes_afip')
@ObjectType()
@Index(['ventaId'])
@Index(['tipoComprobante'])
@Index(['estado'])
@Index(['puntoVenta', 'numeroComprobante'], { unique: true })
export class ComprobanteAfip {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  ventaId: number;

  @ManyToOne(() => VentaCaja, venta => venta.comprobantesAfip)
  @JoinColumn({ name: 'ventaId' })
  @Field(() => VentaCaja)
  venta: VentaCaja;

  @Column({
    type: 'enum',
    enum: TipoComprobanteAfip,
  })
  @Field(() => TipoComprobanteAfip)
  tipoComprobante: TipoComprobanteAfip;

  @Column({
    type: 'enum',
    enum: EstadoComprobanteAfip,
    default: EstadoComprobanteAfip.PENDIENTE,
  })
  @Field(() => EstadoComprobanteAfip)
  estado: EstadoComprobanteAfip;

  @Column({ type: 'int' })
  @Field()
  puntoVenta: number;

  @Column({ type: 'bigint', nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: number;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  cae?: string; // Código de Autorización Electrónico

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  vencimientoCae?: Date;

  @Column({ length: 11, nullable: true })
  @Field({ nullable: true })
  cuitCliente?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  importeTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  importeGravado: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  importeExento: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  importeIva: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  urlPdf?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  mensajeError?: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true })
  datosAfip?: string; // JSON con respuesta completa de AFIP

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
  @Field()
  actualizadoEn: Date;
}
