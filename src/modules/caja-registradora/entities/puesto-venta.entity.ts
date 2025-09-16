import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { VentaCaja } from './venta-caja.entity';

@Entity('puestos_venta')
@ObjectType()
@Index(['codigo'], { unique: true })
@Index(['activo'])
export class PuestoVenta {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ length: 20, unique: true })
  @Field()
  codigo: string;

  @Column({ length: 100 })
  @Field()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  descripcion?: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  ubicacion?: string;

  @Column({ default: true })
  @Field()
  activo: boolean;

  @Column({ default: true })
  @Field()
  permiteFacturacion: boolean;

  @Column({ default: true })
  @Field()
  descontarStock: boolean;

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true })
  configuracion?: string; // JSON con configuraciones específicas del puesto

  @CreateDateColumn()
  @Field()
  creadoEn: Date;

  @UpdateDateColumn()
  @Field()
  actualizadoEn: Date;

  // Relaciones
  @OneToMany(() => VentaCaja, venta => venta.puestoVenta)
  @Field(() => [VentaCaja], { nullable: true })
  ventas?: VentaCaja[];
}
