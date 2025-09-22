import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Object)
    private repository: Repository<any>,
  ) {}

  /**
   * Ejecuta una query SQL con parámetros de forma segura
   */
  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    return this.repository.query(query, params);
  }

  /**
   * Ejecuta múltiples queries en una transacción
   */
  async executeTransaction(queries: { query: string; params: any[] }[]): Promise<boolean> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    
    try {
      await queryRunner.startTransaction();
      
      for (const { query, params } of queries) {
        await queryRunner.query(query, params);
      }
      
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Construye query de paginación estándar
   */
  buildPaginationQuery(
    baseQuery: string,
    params: any[],
    offset: number,
    limit: number,
    orderBy: string = 'id ASC'
  ): { query: string; params: any[] } {
    const query = `${baseQuery} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    return {
      query,
      params: [...params, limit, offset]
    };
  }

  /**
   * Construye query de conteo para paginación
   */
  buildCountQuery(baseQuery: string): string {
    // Remover SELECT y FROM para crear COUNT
    const fromIndex = baseQuery.toUpperCase().indexOf('FROM');
    if (fromIndex === -1) {
      throw new Error('Query inválida: no contiene FROM');
    }
    
    const fromClause = baseQuery.substring(fromIndex);
    return `SELECT COUNT(*) as total ${fromClause}`;
  }

  /**
   * Construye condiciones WHERE dinámicas
   */
  buildWhereConditions(
    filters: Record<string, any>,
    searchFields: string[] = []
  ): { whereClause: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];

    // Filtros exactos
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        conditions.push(`${field} = ?`);
        params.push(value);
      }
    });

    // Búsqueda en múltiples campos
    if (filters.search && searchFields.length > 0) {
      const searchConditions = searchFields.map(field => `${field} LIKE ?`);
      conditions.push(`(${searchConditions.join(' OR ')})`);
      const searchParam = `%${filters.search}%`;
      searchFields.forEach(() => params.push(searchParam));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    return { whereClause, params };
  }
}
