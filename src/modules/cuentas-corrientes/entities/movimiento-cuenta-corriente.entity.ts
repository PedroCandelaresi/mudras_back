import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { CuentaCorriente } from './cuenta-corriente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoMovimientoCuentaCorriente {
  DEBITO = 'debito',
  CREDITO = 'credito',
}

registerEnumType(TipoMovimientoCuentaCorriente, {
  name: 'TipoMovimientoCuentaCorriente',
  description: 'Tipo de movimiento en cuenta corriente',
});

export enum ConceptoMovimientoCuentaCorriente {
  VENTA = 'venta',
  PAGO = 'pago',
  COMPRA = 'compra',
  AJUSTE = 'ajuste',
  INTERES = 'interes',
  DESCUENTO = 'descuento',
}

registerEnumType(ConceptoMovimientoCuentaCorriente, {
  name: 'ConceptoMovimientoCuentaCorriente',
  description: 'Concepto del movimiento en cuenta corriente',
});

@Entity('movimientos_cuenta_corriente')
@ObjectType()
@Index(['cuentaCorrienteId'])
@Index(['tipo'])
@Index(['concepto'])
@Index(['fecha'])
@Index(['usuarioId'])
export class MovimientoCuentaCorriente {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  cuentaCorrienteId: number;

  @ManyToOne(() => CuentaCorriente, cuentaCorriente => cuentaCorriente.movimientos)
  @JoinColumn({ name: 'cuentaCorrienteId' })
  @Field(() => CuentaCorriente)
  cuentaCorriente: CuentaCorriente;

  @Column({
    type: 'enum',
    enum: TipoMovimientoCuentaCorriente,
  })
  @Field(() => TipoMovimientoCuentaCorriente)
  tipo: TipoMovimientoCuentaCorriente;

  @Column({
    type: 'enum',
    enum: ConceptoMovimientoCuentaCorriente,
  })
  @Field(() => ConceptoMovimientoCuentaCorriente)
  concepto: ConceptoMovimientoCuentaCorriente;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  monto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  saldoAnterior: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  saldoNuevo: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  descripcion?: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column({ type: 'date' })
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
