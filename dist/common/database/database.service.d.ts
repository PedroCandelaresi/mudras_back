import { Repository } from 'typeorm';
export declare class DatabaseService {
    private repository;
    constructor(repository: Repository<any>);
    executeQuery(query: string, params?: any[]): Promise<any[]>;
    executeTransaction(queries: {
        query: string;
        params: any[];
    }[]): Promise<boolean>;
    buildPaginationQuery(baseQuery: string, params: any[], offset: number, limit: number, orderBy?: string): {
        query: string;
        params: any[];
    };
    buildCountQuery(baseQuery: string): string;
    buildWhereConditions(filters: Record<string, any>, searchFields?: string[]): {
        whereClause: string;
        params: any[];
    };
}
