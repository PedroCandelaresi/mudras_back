import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateMudrasAuthTables1714848000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
