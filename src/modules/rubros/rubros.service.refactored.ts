import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class RubrosServiceRefactored {
  constructor(
    @InjectRepository(Rubro)
    private rubrosRepository: Repository<Rubro>,
    private databaseService: DatabaseService,
  ) {}

  // ==========================================
  // QUERIES MODULARES Y REUTILIZABLES
  // ==========================================

  private readonly QUERIES = {
    // Consultas base reutilizables
    BASE_RUBROS: `
      SELECT 
        r.Id as id,
        COALESCE(r.Rubro, '') as nombre,
        r.Codigo as codigo,
        r.PorcentajeRecargo as porcentajeRecargo,
        r.PorcentajeDescuento as porcentajeDescuento
      FROM tbrubros r
    `,

    BASE_RUBROS_CON_ESTADISTICAS: `
      SELECT 
        r.Id as id,
        COALESCE(r.Rubro, '') as nombre,
        r.Codigo as codigo,
        r.PorcentajeRecargo as porcentajeRecargo,
        r.PorcentajeDescuento as porcentajeDescuento,
        COUNT(DISTINCT a.id) as cantidadArticulos,
        COUNT(DISTINCT pr.proveedor_id) as cantidadProveedores
      FROM tbrubros r
      LEFT JOIN tbarticulos a ON a.Rubro = r.Rubro
      LEFT JOIN tb_proveedor_rubro pr ON pr.rubro_nombre = r.Rubro
    `,

    PROVEEDORES_POR_RUBRO: `
      SELECT DISTINCT 
        p.IdProveedor as id,
        p.Nombre as nombre,
        p.Codigo as codigo,
        p.Mail as email,
        p.Telefono as telefono
      FROM tbproveedores p
      INNER JOIN tb_proveedor_rubro pr ON pr.proveedor_id = p.IdProveedor
      INNER JOIN tbrubros r ON r.Rubro = pr.rubro_nombre
      WHERE r.Id = ?
    `,

    ARTICULOS_POR_RUBRO: `
      SELECT 
        a.id,
        a.Codigo as codigo,
        a.Descripcion as descripcion,
        a.PrecioVenta as precio,
        a.Deposito as stock,
        p.IdProveedor as proveedorId,
        p.Nombre as proveedorNombre
      FROM tbarticulos a
      INNER JOIN tbrubros r ON a.Rubro = r.Rubro
      INNER JOIN tbproveedores p ON a.idProveedor = p.IdProveedor
      INNER JOIN tb_proveedor_rubro pr ON pr.proveedor_id = p.IdProveedor AND pr.rubro_nombre = r.Rubro
      WHERE r.Id = ?
    `,

    ELIMINAR_PROVEEDOR_TRANSACCION: [
      {
        query: 'UPDATE tbarticulos SET idProveedor = NULL WHERE idProveedor = ? AND Rubro = ?',
        description: 'Actualizar artículos sin proveedor'
      },
      {
        query: 'DELETE FROM tb_proveedor_rubro WHERE proveedor_id = ? AND rubro_nombre = ?',
        description: 'Eliminar relación proveedor-rubro'
      }
    ]
  };

  // ==========================================
  // MÉTODOS PÚBLICOS OPTIMIZADOS
  // ==========================================

  async findAll(pagina: number = 0, limite: number = 50, busqueda?: string): Promise<{ rubros: any[], total: number }> {
    const offset = pagina * limite;
    
    // Construir condiciones de búsqueda
    const { whereClause, params } = this.databaseService.buildWhereConditions(
      { search: busqueda },
      ['r.Rubro', 'r.Codigo']
    );

    // Query base con condiciones
    const baseQuery = `${this.QUERIES.BASE_RUBROS_CON_ESTADISTICAS} ${whereClause} GROUP BY r.Id, r.Rubro, r.Codigo, r.PorcentajeRecargo, r.PorcentajeDescuento`;
    
    // Construir queries de datos y conteo
    const { query: dataQuery, params: dataParams } = this.databaseService.buildPaginationQuery(
      baseQuery,
      params,
      offset,
      limite,
      'r.Rubro ASC'
    );

    const countQuery = this.databaseService.buildCountQuery(baseQuery);

    // Ejecutar ambas queries en paralelo
    const [rubros, totalResult] = await Promise.all([
      this.databaseService.executeQuery(dataQuery, dataParams),
      this.databaseService.executeQuery(countQuery, params)
    ]);

    return {
      rubros,
      total: totalResult[0]?.total || 0
    };
  }

  async findOne(id: number): Promise<Rubro> {
    const query = `${this.QUERIES.BASE_RUBROS} WHERE r.Id = ?`;
    const result = await this.databaseService.executeQuery(query, [id]);
    return result[0] || null;
  }

  async findByNombre(rubro: string): Promise<Rubro> {
    const query = `${this.QUERIES.BASE_RUBROS} WHERE r.Rubro = ?`;
    const result = await this.databaseService.executeQuery(query, [rubro]);
    return result[0] || null;
  }

  async create(nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro> {
    const nuevoRubro = this.rubrosRepository.create({
      Rubro: nombre,
      Codigo: codigo || null,
      PorcentajeRecargo: porcentajeRecargo || 0,
      PorcentajeDescuento: porcentajeDescuento || 0
    });
    
    return await this.rubrosRepository.save(nuevoRubro);
  }

  async update(id: number, nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro> {
    await this.rubrosRepository.update(id, {
      Rubro: nombre,
      Codigo: codigo || null,
      PorcentajeRecargo: porcentajeRecargo || 0,
      PorcentajeDescuento: porcentajeDescuento || 0
    });
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    // Verificar artículos asociados
    const articulosCount = await this.databaseService.executeQuery(
      'SELECT COUNT(*) as count FROM tbarticulos WHERE Rubro = (SELECT Rubro FROM tbrubros WHERE Id = ?)',
      [id]
    );

    if (articulosCount[0].count > 0) {
      throw new Error('No se puede eliminar el rubro porque tiene artículos asociados');
    }

    const result = await this.rubrosRepository.delete(id);
    return result.affected > 0;
  }

  async getProveedoresPorRubro(rubroId: number): Promise<any[]> {
    return this.databaseService.executeQuery(
      `${this.QUERIES.PROVEEDORES_POR_RUBRO} ORDER BY p.Nombre ASC`,
      [rubroId]
    );
  }

  async getArticulosPorRubro(
    rubroId: number, 
    filtro?: string, 
    offset: number = 0, 
    limit: number = 50
  ): Promise<{ articulos: any[], total: number }> {
    
    // Construir condiciones de filtro
    const { whereClause, params } = this.databaseService.buildWhereConditions(
      { search: filtro },
      ['a.Codigo', 'a.Descripcion', 'p.Nombre']
    );

    // Query base con filtros
    const baseQuery = `${this.QUERIES.ARTICULOS_POR_RUBRO} ${whereClause}`;
    const baseParams = [rubroId, ...params];

    // Construir queries de datos y conteo
    const { query: dataQuery, params: dataParams } = this.databaseService.buildPaginationQuery(
      baseQuery,
      baseParams,
      offset,
      limit,
      'a.Codigo ASC'
    );

    const countQuery = this.databaseService.buildCountQuery(baseQuery);

    // Ejecutar ambas queries en paralelo
    const [articulos, totalResult] = await Promise.all([
      this.databaseService.executeQuery(dataQuery, dataParams),
      this.databaseService.executeQuery(countQuery, baseParams)
    ]);

    // Formatear artículos
    const articulosFormateados = articulos.map(articulo => ({
      id: articulo.id,
      codigo: articulo.codigo,
      descripcion: articulo.descripcion,
      precio: parseFloat(articulo.precio) || 0,
      stock: parseInt(articulo.stock) || 0,
      proveedor: articulo.proveedorId ? {
        id: articulo.proveedorId,
        nombre: articulo.proveedorNombre
      } : null
    }));

    return { 
      articulos: articulosFormateados, 
      total: totalResult[0]?.total || 0
    };
  }

  async eliminarProveedorDeRubro(proveedorId: number, rubroNombre: string): Promise<boolean> {
    try {
      // Preparar transacciones
      const transacciones = this.QUERIES.ELIMINAR_PROVEEDOR_TRANSACCION.map(({ query }) => ({
        query,
        params: [proveedorId, rubroNombre]
      }));

      // Ejecutar en transacción
      await this.databaseService.executeTransaction(transacciones);

      // Verificar si el proveedor tiene más rubros
      const rubrosRestantes = await this.databaseService.executeQuery(
        'SELECT COUNT(*) as count FROM tb_proveedor_rubro WHERE proveedor_id = ?',
        [proveedorId]
      );

      // Limpiar tbproveedores si no tiene más rubros
      if (rubrosRestantes[0].count === 0) {
        await this.databaseService.executeQuery(
          'UPDATE tbproveedores SET Rubro = NULL WHERE IdProveedor = ?',
          [proveedorId]
        );
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar proveedor del rubro:', error);
      throw new Error('No se pudo eliminar el proveedor del rubro');
    }
  }

  async eliminarArticuloDeRubro(articuloId: number): Promise<boolean> {
    try {
      const result = await this.databaseService.executeQuery(
        'UPDATE tbarticulos SET Rubro = NULL WHERE id = ?',
        [articuloId]
      );

      return Array.isArray(result) ? result.length > 0 : (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar artículo del rubro:', error);
      throw new Error('No se pudo eliminar el artículo del rubro');
    }
  }

  async eliminarArticulosDeRubro(articuloIds: number[]): Promise<boolean> {
    if (articuloIds.length === 0) {
      return false;
    }

    try {
      const placeholders = articuloIds.map(() => '?').join(',');
      const result = await this.databaseService.executeQuery(
        `UPDATE tbarticulos SET Rubro = NULL WHERE id IN (${placeholders})`,
        articuloIds
      );

      return Array.isArray(result) ? result.length > 0 : (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar artículos del rubro:', error);
      throw new Error('No se pudo eliminar los artículos del rubro');
    }
  }

  // ==========================================
  // MÉTODOS DE UTILIDAD Y ESTADÍSTICAS
  // ==========================================

  async getEstadisticasRubro(rubroId: number): Promise<any> {
    const query = `
      SELECT 
        COUNT(DISTINCT a.id) as totalArticulos,
        COUNT(DISTINCT pr.proveedor_id) as totalProveedores,
        AVG(a.PrecioVenta) as precioPromedio,
        SUM(a.Deposito) as stockTotal
      FROM tbrubros r
      LEFT JOIN tbarticulos a ON a.Rubro = r.Rubro
      LEFT JOIN tb_proveedor_rubro pr ON pr.rubro_nombre = r.Rubro
      WHERE r.Id = ?
      GROUP BY r.Id
    `;

    const result = await this.databaseService.executeQuery(query, [rubroId]);
    return result[0] || {
      totalArticulos: 0,
      totalProveedores: 0,
      precioPromedio: 0,
      stockTotal: 0
    };
  }
}
