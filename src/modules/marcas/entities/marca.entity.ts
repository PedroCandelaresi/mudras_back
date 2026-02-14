import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Articulo } from '../../articulos/entities/articulo.entity';

@ObjectType()
@Entity('mudras_marcas')
export class Marca {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    Descripcion: string;

    // Optional: Add relation if we refactor Articulo later to link by ID
    // @OneToMany(() => Articulo, articulo => articulo.marca)
    // articulos: Articulo[];
}
