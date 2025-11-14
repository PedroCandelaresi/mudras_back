import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Float, Int } from '@nestjs/graphql';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { DetalleOrdenCompra } from './detalle-orden-compra.entity';

export enum EstadoOrdenCompra {
  BORRADOR = 'BORRADOR',
  EMITIDA = 'EMITIDA',
  RECEPCIONADA = 'RECEPCIONADA',
  ANULADA = 'ANULADA',
}

registerEnumType(EstadoOrdenCompra, { name: 'EstadoOrdenCompra' });

@ObjectType()
@Entity('tborden_compra')
export class OrdenCompra {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: 'int' })
  proveedorId: number;

  @Field(() => EstadoOrdenCompra)
  @Column({ type: 'varchar', length: 20, default: EstadoOrdenCompra.BORRADOR })
  estado: EstadoOrdenCompra;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Field()
  @CreateDateColumn({ type: 'datetime' })
  creadoEn: Date;

  @Field()
  @UpdateDateColumn({ type: 'datetime' })
  actualizadoEn: Date;

  @Field({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  fechaEmision?: Date;

  @Field({ nullable: true })
  @Column({ type: 'datetime', nullable: true })
  fechaRecepcion?: Date;

  @Field(() => [DetalleOrdenCompra], { nullable: true })
  @OneToMany(() => DetalleOrdenCompra, (d) => d.orden, { cascade: true })
  detalles?: DetalleOrdenCompra[];

  @Field(() => Proveedor, { nullable: true })
  @ManyToOne(() => Proveedor, (p) => p.ordenesCompra)
  @JoinColumn({ name: 'proveedorId' })
  proveedor?: Proveedor;
}

