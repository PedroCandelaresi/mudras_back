import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleAsientoContable } from './detalle-asiento-contable.entity';

export enum TipoAsientoContable {
  VENTA = 'venta',
  COMPRA = 'compra',
  PAGO = 'pago',
  COBRO = 'cobro',
  AJUSTE = 'ajuste',
  CIERRE_CAJA = 'cierre_caja',
  APERTURA_CAJA = 'apertura_caja',
}

registerEnumType(TipoAsientoContable, {
  name: 'TipoAsientoContable',
  description: 'Tipos de asientos contables',
});

export enum EstadoAsientoContable {
  BORRADOR = 'borrador',
  CONFIRMADO = 'confirmado',
  ANULADO = 'anulado',
}

registerEnumType(EstadoAsientoContable, {
  name: 'EstadoAsientoContable',
  description: 'Estados de asientos contables',
});

@Entity('asientos_contables')
@ObjectType()
@Index(['numero'], { unique: true })
@Index(['tipo'])
@Index(['estado'])
@Index(['fecha'])
@Index(['usuarioId'])
export class AsientoContable {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 20, unique: true })
  @Field()
  numero: string;

  @Column({
    type: 'enum',
    enum: TipoAsientoContable,
  })
  @Field(() => TipoAsientoContable)
  tipo: TipoAsientoContable;

  @Column({
    type: 'enum',
    enum: EstadoAsientoContable,
    default: EstadoAsientoContable.BORRADOR,
  })
  @Field(() => EstadoAsientoContable)
  estado: EstadoAsientoContable;

  @Column({ type: 'date' })
  @Field()
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  totalDebe: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  @Field()
  totalHaber: number;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Usuario, usuario => usuario.asientosContables)
  @JoinColumn({ name: 'usuarioId' })
  @Field(() => Usuario)
  usuario: Usuario;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
  @Field()
  actualizadoEn: Date;

  @Column({ type: 'datetime', nullable: true })
  @Field({ nullable: true })
  fechaAnulacion?: Date;

  @Column({ nullable: true })
  usuarioAnulacionId?: number;

  // Relaciones
  @OneToMany(() => DetalleAsientoContable, detalle => detalle.asientoContable)
  @Field(() => [DetalleAsientoContable], { nullable: true })
  detalles?: DetalleAsientoContable[];
}
