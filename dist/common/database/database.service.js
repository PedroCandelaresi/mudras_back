"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DatabaseService = class DatabaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async executeQuery(query, params = []) {
        return this.repository.query(query, params);
    }
    async executeTransaction(queries) {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        try {
            await queryRunner.startTransaction();
            for (const { query, params } of queries) {
                await queryRunner.query(query, params);
            }
            await queryRunner.commitTransaction();
            return true;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    buildPaginationQuery(baseQuery, params, offset, limit, orderBy = 'id ASC') {
        const query = `${baseQuery} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
        return {
            query,
            params: [...params, limit, offset]
        };
    }
    buildCountQuery(baseQuery) {
        const fromIndex = baseQuery.toUpperCase().indexOf('FROM');
        if (fromIndex === -1) {
            throw new Error('Query inválida: no contiene FROM');
        }
        const fromClause = baseQuery.substring(fromIndex);
        return `SELECT COUNT(*) as total ${fromClause}`;
    }
    buildWhereConditions(filters, searchFields = []) {
        const conditions = [];
        const params = [];
        Object.entries(filters).forEach(([field, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                conditions.push(`${field} = ?`);
                params.push(value);
            }
        });
        if (filters.search && searchFields.length > 0) {
            const searchConditions = searchFields.map(field => `${field} LIKE ?`);
            conditions.push(`(${searchConditions.join(' OR ')})`);
            const searchParam = `%${filters.search}%`;
            searchFields.forEach(() => params.push(searchParam));
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        return { whereClause, params };
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Object)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DatabaseService);
//# sourceMappingURL=database.service.js.map