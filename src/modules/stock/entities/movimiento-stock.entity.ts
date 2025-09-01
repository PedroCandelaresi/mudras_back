import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum TipoMovimientoStock {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
  AJUSTE_POSITIVO = 'ajuste_positivo',
  AJUSTE_NEGATIVO = 'ajuste_negativo',
  TRANSFERENCIA_ENTRADA = 'transferencia_entrada',
  TRANSFERENCIA_SALIDA = 'transferencia_salida',
}

registerEnumType(TipoMovimientoStock, {
  name: 'TipoMovimientoStock',
  description: 'Tipos de movimientos de stock',
});

export enum ConceptoMovimientoStock {
  COMPRA = 'compra',
  VENTA = 'venta',
  DEVOLUCION_CLIENTE = 'devolucion_cliente',
  DEVOLUCION_PROVEEDOR = 'devolucion_proveedor',
  AJUSTE_INVENTARIO = 'ajuste_inventario',
  ROTURA = 'rotura',
  VENCIMIENTO = 'vencimiento',
  TRANSFERENCIA = 'transferencia',
  PRODUCCION = 'produccion',
}

registerEnumType(ConceptoMovimientoStock, {
  name: 'ConceptoMovimientoStock',
  description: 'Conceptos de movimientos de stock',
});

@Entity('movimientos_stock')
@ObjectType()
@Index(['articuloId'])
@Index(['tipo'])
@Index(['concepto'])
@Index(['fecha'])
@Index(['usuarioId'])
export class MovimientoStock {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  articuloId: number;

  @ManyToOne(() => Articulo, articulo => articulo.movimientosStock)
  @JoinColumn({ name: 'articuloId' })
  @Field(() => Articulo)
  articulo: Articulo;

  @Column({
    type: 'enum',
    enum: TipoMovimientoStock,
  })
  @Field(() => TipoMovimientoStock)
  tipo: TipoMovimientoStock;

  @Column({
    type: 'enum',
    enum: ConceptoMovimientoStock,
  })
  @Field(() => ConceptoMovimientoStock)
  concepto: ConceptoMovimientoStock;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockAnterior: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @Field()
  stockNuevo: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field({ nullable: true })
  costoUnitario?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  @Field({ nullable: true })
  costoTotal?: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  observaciones?: string;

  @Column({ length: 50, nullable: true })
  @Field({ nullable: true })
  numeroComprobante?: string;

  @Column({ type: 'date' })
  @Field()
  fecha: Date;

  @Column()
  usuarioId: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  @Field(() => Usuario)
  usuario: Usuario;

  @CreateDateColumn()
  @Field()
  creadoEn: Date;
}
