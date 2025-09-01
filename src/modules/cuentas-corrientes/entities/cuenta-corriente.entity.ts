import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { MovimientoCuentaCorriente } from './movimiento-cuenta-corriente.entity';

export enum TipoCuentaCorriente {
  CLIENTE = 'cliente',
  PROVEEDOR = 'proveedor',
}

registerEnumType(TipoCuentaCorriente, {
  name: 'TipoCuentaCorriente',
  description: 'Tipo de cuenta corriente',
});

export enum EstadoCuentaCorriente {
  ACTIVA = 'activa',
  SUSPENDIDA = 'suspendida',
  CERRADA = 'cerrada',
}

registerEnumType(EstadoCuentaCorriente, {
  name: 'EstadoCuentaCorriente',
  description: 'Estado de la cuenta corriente',
});

@Entity('cuentas_corrientes')
@ObjectType()
@Index(['tipo'])
@Index(['estado'])
@Index(['clienteId'])
@Index(['proveedorId'])
@Index(['usuarioId'])
export class CuentaCorriente {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({
    type: 'enum',
    enum: TipoCuentaCorriente,
  })
  @Field(() => TipoCuentaCorriente)
  tipo: TipoCuentaCorriente;

  @Column({
    type: 'enum',
    enum: EstadoCuentaCorriente,
    default: EstadoCuentaCorriente.ACTIVA,
  })
  @Field(() => EstadoCuentaCorriente)
  estado: EstadoCuentaCorriente;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  saldoActual: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  limiteCredito: number;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  fechaVencimiento?: Date;

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
  @Column({ nullable: true })
  clienteId?: number;

  @ManyToOne(() => Cliente, cliente => cliente.cuentasCorrientes, { nullable: true })
  @JoinColumn({ name: 'clienteId' })
  @Field(() => Cliente, { nullable: true })
  cliente?: Cliente;

  @Column({ nullable: true })
  proveedorId?: number;

  @ManyToOne(() => Proveedor, proveedor => proveedor.cuentasCorrientes, { nullable: true })
  @JoinColumn({ name: 'proveedorId' })
  @Field(() => Proveedor, { nullable: true })
  proveedor?: Proveedor;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Usuario, usuario => usuario.cuentasCorrientes)
  @JoinColumn({ name: 'usuarioId' })
  @Field(() => Usuario)
  usuario: Usuario;

  @OneToMany(() => MovimientoCuentaCorriente, movimiento => movimiento.cuentaCorriente)
  @Field(() => [MovimientoCuentaCorriente], { nullable: true })
  movimientos?: MovimientoCuentaCorriente[];
}
