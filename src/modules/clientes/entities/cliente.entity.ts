import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { CuentaCorriente } from '../../cuentas-corrientes/entities/cuenta-corriente.entity';
import { Venta } from '../../ventas/entities/venta.entity';

export enum TipoCliente {
  MINORISTA = 'minorista',
  MAYORISTA = 'mayorista',
  DISTRIBUIDOR = 'distribuidor',
}

registerEnumType(TipoCliente, {
  name: 'TipoCliente',
  description: 'Tipos de cliente disponibles',
});

export enum EstadoCliente {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  MOROSO = 'moroso',
}

registerEnumType(EstadoCliente, {
  name: 'EstadoCliente',
  description: 'Estados disponibles para clientes',
});

@Entity('clientes')
@ObjectType()
@Index(['email'], { unique: true })
@Index(['cuit'], { unique: true })
@Index(['tipo'])
@Index(['estado'])
@Index(['nombre'])
export class Cliente {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 100 })
  @Field()
  nombre: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  apellido?: string;

  @Column({ length: 150, nullable: true })
  @Field({ nullable: true })
  razonSocial?: string;

  @Column({ length: 13, unique: true, nullable: true })
  @Field({ nullable: true })
  cuit?: string;

  @Column({ length: 150, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  telefono?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  direccion?: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  ciudad?: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  provincia?: string;

  @Column({ length: 10, nullable: true })
  @Field({ nullable: true })
  codigoPostal?: string;

  @Column({
    type: 'enum',
    enum: TipoCliente,
    default: TipoCliente.MINORISTA,
  })
  @Field(() => TipoCliente)
  tipo: TipoCliente;

  @Column({
    type: 'enum',
    enum: EstadoCliente,
    default: EstadoCliente.ACTIVO,
  })
  @Field(() => EstadoCliente)
  estado: EstadoCliente;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field()
  descuentoGeneral: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  limiteCredito: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  @Field()
  saldoActual: number;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  fechaNacimiento?: Date;

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
  @OneToMany(() => CuentaCorriente, cuentaCorriente => cuentaCorriente.cliente)
  @Field(() => [CuentaCorriente], { nullable: true })
  cuentasCorrientes?: CuentaCorriente[];

  @OneToMany(() => Venta, venta => venta.cliente)
  @Field(() => [Venta], { nullable: true })
  ventas?: Venta[];
}
