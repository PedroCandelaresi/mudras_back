import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { DetalleAsientoContable } from './detalle-asiento-contable.entity';

export enum TipoCuentaContable {
  ACTIVO = 'activo',
  PASIVO = 'pasivo',
  PATRIMONIO = 'patrimonio',
  INGRESO = 'ingreso',
  EGRESO = 'egreso',
}

registerEnumType(TipoCuentaContable, {
  name: 'TipoCuentaContable',
  description: 'Tipos de cuentas contables',
});

export enum EstadoCuentaContable {
  ACTIVA = 'activa',
  INACTIVA = 'inactiva',
}

registerEnumType(EstadoCuentaContable, {
  name: 'EstadoCuentaContable',
  description: 'Estados de cuentas contables',
});

@Entity('cuentas_contables')
@ObjectType()

@Index(['tipo'])
@Index(['estado'])
@Index(['cuentaPadreId'])
export class CuentaContable {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 20, unique: true })
  @Field()
  codigo: string;

  @Column({ length: 150 })
  @Field()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  descripcion?: string;

  @Column({
    type: 'enum',
    enum: TipoCuentaContable,
  })
  @Field(() => TipoCuentaContable)
  tipo: TipoCuentaContable;

  @Column({
    type: 'enum',
    enum: EstadoCuentaContable,
    default: EstadoCuentaContable.ACTIVA,
  })
  @Field(() => EstadoCuentaContable)
  estado: EstadoCuentaContable;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  saldoActual: number;

  @Column({ type: 'boolean', default: true })
  @Field()
  aceptaMovimientos: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true })
  cuentaPadreId?: number;

  @Column({ type: 'int', default: 0 })
  @Field()
  nivel: number;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
  @Field()
  actualizadoEn: Date;

  // Relaciones
  @OneToMany(() => DetalleAsientoContable, detalle => detalle.cuentaContable)
  @Field(() => [DetalleAsientoContable], { nullable: true })
  detallesAsientos?: DetalleAsientoContable[];
}
