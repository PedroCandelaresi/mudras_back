import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoPromocion {
  ACTIVA = 'ACTIVA',
  PROGRAMADA = 'PROGRAMADA',
  FINALIZADA = 'FINALIZADA',
}

registerEnumType(EstadoPromocion, { name: 'EstadoPromocion' });

@ObjectType()
@Entity('promociones')
export class Promocion {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Field()
  @Column({ type: 'date' })
  inicio: string; // ISO Date (YYYY-MM-DD)

  @Field()
  @Column({ type: 'date' })
  fin: string; // ISO Date

  @Field(() => EstadoPromocion)
  @Column({ type: 'enum', enum: EstadoPromocion, default: EstadoPromocion.PROGRAMADA })
  estado: EstadoPromocion;

  @Field()
  @Column({ type: 'int', default: 0 })
  descuento: number; // 0-100

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
