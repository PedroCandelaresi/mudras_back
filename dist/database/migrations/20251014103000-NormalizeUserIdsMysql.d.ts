import { MigrationInterface, QueryRunner } from "typeorm";
export declare class NormalizeUserIdsMysql20251014103000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
