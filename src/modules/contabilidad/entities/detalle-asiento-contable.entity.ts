import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { AsientoContable } from './asiento-contable.entity';
import { CuentaContable } from './cuenta-contable.entity';

export enum TipoMovimientoContable {
  DEBE = 'debe',
  HABER = 'haber',
}

registerEnumType(TipoMovimientoContable, {
  name: 'TipoMovimientoContable',
  description: 'Tipo de movimiento contable',
});

@Entity('detalles_asientos_contables')
@ObjectType()
@Index(['asientoContableId'])
@Index(['cuentaContableId'])
@Index(['tipo'])
export class DetalleAsientoContable {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  asientoContableId: number;

  @ManyToOne(() => AsientoContable, asiento => asiento.detalles)
  @JoinColumn({ name: 'asientoContableId' })
  @Field(() => AsientoContable)
  asientoContable: AsientoContable;

  @Column()
  cuentaContableId: number;

  @ManyToOne(() => CuentaContable, cuenta => cuenta.detallesAsientos)
  @JoinColumn({ name: 'cuentaContableId' })
  @Field(() => CuentaContable)
  cuentaContable: CuentaContable;

  @Column({
    type: 'enum',
    enum: TipoMovimientoContable,
  })
  @Field(() => TipoMovimientoContable)
  tipo: TipoMovimientoContable;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  monto: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  descripcion?: string;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
  tipoMovimiento: TipoMovimientoContable;
}
