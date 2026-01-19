import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Proveedor } from './proveedor.entity';
import { Rubro } from '../../rubros/entities/rubro.entity';

@ObjectType()
@Entity('mudras_proveedores_rubros')
export class ProveedorRubro {
    @Field(() => Int)
    @PrimaryColumn({ name: 'proveedorId', type: 'int' })
    proveedorId: number;

    @Field(() => Int)
    @PrimaryColumn({ name: 'rubroId', type: 'int' })
    rubroId: number;

    @Field(() => Float, { nullable: true })
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: true })
    porcentajeRecargo: number;

    @Field(() => Float, { nullable: true })
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, nullable: true })
    porcentajeDescuento: number;

    @ManyToOne(() => Proveedor, (proveedor) => proveedor.proveedorRubros, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'proveedorId' })
    proveedor: Proveedor;

    @Field(() => Rubro)
    @ManyToOne(() => Rubro, (rubro) => rubro.proveedorRubros, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'rubroId' })
    rubro: Rubro;
}
