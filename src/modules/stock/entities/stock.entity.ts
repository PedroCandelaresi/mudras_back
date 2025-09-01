import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
@Entity('tbStock')
export class Stock {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  Id: number;

  @Field({ nullable: true })
  @Column({ type: 'date', nullable: true })
  Fecha: Date;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 20, nullable: true })
  Codigo: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  Stock: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', nullable: true })
  StockAnterior: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  Usuario: number;
}
