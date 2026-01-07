import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { CuentaCorriente } from '../../cuentas-corrientes/entities/cuenta-corriente.entity';
import { AsientoContable } from '../../contabilidad/entities/asiento-contable.entity';

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  PROGRAMADOR = 'programador',
  CAJA = 'caja',
  DEPOSITO = 'deposito',
  DIS_GRAFICO = 'dis_grafico',
}

registerEnumType(RolUsuario, {
  name: 'RolUsuario',
  description: 'Roles disponibles para usuarios del sistema',
});

export enum EstadoUsuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido',
}

registerEnumType(EstadoUsuario, {
  name: 'EstadoUsuario',
  description: 'Estados disponibles para usuarios',
});

@Entity('mudras_usuarios')
@ObjectType()
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
@Index(['rol'])
@Index(['estado'])
export class Usuario {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 100 })
  @Field()
  nombre: string;

  @Column({ length: 100 })
  @Field()
  apellido: string;

  @Column({ length: 50, unique: true })
  @Field()
  username: string;

  @Column({ length: 150, unique: true })
  @Field()
  email: string;

  @Column({ length: 255 })
  password: string; // No exponer en GraphQL por seguridad

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.CAJA,
  })
  @Field(() => RolUsuario)
  rol: RolUsuario;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  @Field(() => EstadoUsuario)
  estado: EstadoUsuario;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  telefono?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  direccion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field()
  salario: number;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  fechaIngreso?: Date;

  @Column({ type: 'datetime', nullable: true })
  @Field({ nullable: true })
  ultimoAcceso?: Date;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
  @Field()
  actualizadoEn: Date;

  // Relaciones
  @OneToMany(() => CuentaCorriente, cuentaCorriente => cuentaCorriente.usuario)
  @Field(() => [CuentaCorriente], { nullable: true })
  cuentasCorrientes?: CuentaCorriente[];

  @OneToMany(() => AsientoContable, asiento => asiento.usuario)
  @Field(() => [AsientoContable], { nullable: true })
  asientosContables?: AsientoContable[];
}
