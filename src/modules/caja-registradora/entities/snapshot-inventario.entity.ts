import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('snapshots_inventario_mensual')
@ObjectType()
@Index(['articuloId'])
@Index(['anio', 'mes'])
export class SnapshotInventarioMensual {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  articuloId: number;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articuloId' })
  @Field(() => Articulo)
  articulo: Articulo;

  @Column({ nullable: true })
  puestoVentaId?: number;

  @Column({ type: 'int' })
  @Field()
  anio: number;

  @Column({ type: 'int' })
  @Field()
  mes: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockInicial: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockFinal: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  totalEntradas: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  totalSalidas: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockCalculado: number; // stockInicial + totalEntradas - totalSalidas

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  @Field()
  diferencia: number; // stockFinal - stockCalculado

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field({ nullable: true })
  valorInventario?: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
}
