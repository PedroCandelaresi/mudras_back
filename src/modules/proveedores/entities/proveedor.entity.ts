import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Int, Float, registerEnumType } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { CuentaCorriente } from '../../cuentas-corrientes/entities/cuenta-corriente.entity';
import { Rubro } from '../../rubros/entities/rubro.entity';

export enum EstadoProveedor {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido',
}

registerEnumType(EstadoProveedor, {
  name: 'EstadoProveedor',
  description: 'Estados disponibles para proveedores',
});

@ObjectType()
@Entity('tbproveedores')
export class Proveedor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  IdProveedor: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  Codigo: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Nombre: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Contacto: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Direccion: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  Localidad: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  Provincia: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 8, nullable: true })
  CP: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Telefono: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  Celular: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'smallint', nullable: true })
  TipoIva: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 14, nullable: true })
  CUIT: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  Observaciones: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Web: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  Mail: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  Rubro: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rubroId: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Saldo: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 30, nullable: true })
  Pais: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  Fax: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  FechaModif: Date;


  // Relaciones
  @OneToMany(() => Articulo, articulo => articulo.proveedor)
  @Field(() => [Articulo], { nullable: true })
  articulos?: Articulo[];

  @Field(() => Rubro, { nullable: true })
  @ManyToOne(() => Rubro, rubro => rubro.proveedores)
  @JoinColumn({ name: 'rubroId' })
  rubro?: Rubro;

  @OneToMany(() => CuentaCorriente, cuentaCorriente => cuentaCorriente.proveedor)
  @Field(() => [CuentaCorriente], { nullable: true })
  cuentasCorrientes?: CuentaCorriente[];
}
