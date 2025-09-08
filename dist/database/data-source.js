"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'mudras',
    password: process.env.DB_PASSWORD || 'mudras2025',
    database: process.env.DB_DATABASE || 'mudras',
    synchronize: false,
    logging: true,
    entities: [
        (0, path_1.join)(__dirname, '..', 'modules/**/entities/*.entity.{ts,js}')
    ],
    migrations: [
        (0, path_1.join)(__dirname, 'migrations/*.{ts,js}')
    ],
});
//# sourceMappingURL=data-source.js.map