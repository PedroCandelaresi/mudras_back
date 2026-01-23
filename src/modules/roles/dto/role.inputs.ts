import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CrearRolInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    slug!: string;
}

@InputType()
export class ActualizarRolInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    id!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    slug?: string;
}
