import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUsuariosFromAuth20251014090000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
