import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';

@Injectable()
export class RubrosService {
  constructor(
    @InjectRepository(Rubro)
    private rubrosRepository: Repository<Rubro>,
  ) { }

  async findAll(pagina: number = 0, limite: number = 50, busqueda?: string): Promise<{ rubros: any[], total: number }> {
    const offset = pagina * limite;

    // Query para contar el total
    let countQuery = `
      SELECT COUNT(DISTINCT r.Id) as total
      FROM mudras_rubros r
    `;

    // Query principal con paginación
    let query = `
      SELECT 
        r.Id as id,
        COALESCE(r.Rubro, '') as nombre,
        r.Codigo as codigo,
        COALESCE(r.PorcentajeRecargo, 0) as porcentajeRecargo,
        COALESCE(r.PorcentajeDescuento, 0) as porcentajeDescuento,
        COUNT(DISTINCT a.id) as cantidadArticulos,
        COUNT(DISTINCT p.IdProveedor) as cantidadProveedores
      FROM mudras_rubros r
      LEFT JOIN (
        SELECT DISTINCT a.Rubro, a.id, a.idProveedor
        FROM mudras_articulos a
        INNER JOIN mudras_proveedores p ON a.idProveedor = p.IdProveedor
        INNER JOIN mudras_proveedor_rubro pr ON pr.proveedor_id = p.IdProveedor 
        WHERE pr.rubro_nombre COLLATE utf8mb4_unicode_ci = a.Rubro COLLATE utf8mb4_unicode_ci
      ) a ON a.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
      LEFT JOIN mudras_proveedores p ON a.idProveedor = p.IdProveedor
    `;

    const params: any[] = [];

    // Agregar filtro de búsqueda si existe
    if (busqueda && busqueda.trim()) {
      const whereClause = ` WHERE (r.Rubro LIKE ? OR r.Codigo LIKE ?)`;
      countQuery += whereClause;
      query += whereClause;
      const searchParam = `%${busqueda.trim()}%`;
      params.push(searchParam, searchParam);
    }

    query += `
      GROUP BY r.Id, r.Rubro, r.Codigo, r.PorcentajeRecargo, r.PorcentajeDescuento
      ORDER BY r.Rubro ASC
      LIMIT ? OFFSET ?
    `;

    params.push(limite, offset);

    // Ejecutar ambas queries
    const [rubros, totalResult] = await Promise.all([
      this.rubrosRepository.query(query, params),
      this.rubrosRepository.query(countQuery, busqueda && busqueda.trim() ? params.slice(0, -2) : [])
    ]);

    const total = totalResult[0]?.total || 0;

    return { rubros, total };
  }

  async findOne(id: number): Promise<Rubro> {
    return this.rubrosRepository.findOne({
      where: { Id: id },
    });
  }

  async findByNombre(rubro: string): Promise<Rubro> {
    return this.rubrosRepository.findOne({
      where: { Rubro: rubro },
    });
  }

  async create(nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro> {
    const nuevoRubro = this.rubrosRepository.create({
      Rubro: nombre,
      Codigo: codigo || null,
      PorcentajeRecargo: porcentajeRecargo ?? 0,
      PorcentajeDescuento: porcentajeDescuento ?? 0
    });

    return await this.rubrosRepository.save(nuevoRubro);
  }

  async update(id: number, nombre: string, codigo?: string, porcentajeRecargo?: number, porcentajeDescuento?: number): Promise<Rubro> {
    await this.rubrosRepository.update(id, {
      Rubro: nombre,
      Codigo: codigo || null,
      PorcentajeRecargo: porcentajeRecargo ?? 0,
      PorcentajeDescuento: porcentajeDescuento ?? 0
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    // Verificar si hay artículos usando este rubro
    const articulosCount = await this.rubrosRepository.query(
      'SELECT COUNT(*) as count FROM mudras_articulos WHERE Rubro = (SELECT Rubro FROM mudras_rubros WHERE Id = ?)',
      [id]
    );

    if (articulosCount[0].count > 0) {
      throw new Error('No se puede eliminar el rubro porque tiene artículos asociados');
    }

    const result = await this.rubrosRepository.delete(id);
    return result.affected > 0;
  }

  async getProveedoresPorRubro(rubroId: number): Promise<any[]> {
    const query = `
      SELECT DISTINCT 
        p.IdProveedor as id,
        p.Nombre as nombre,
        p.Codigo as codigo,
        p.Mail as email,
        p.Telefono as telefono
      FROM mudras_proveedores p
      INNER JOIN mudras_articulos a ON p.IdProveedor = a.idProveedor
      INNER JOIN mudras_rubros r ON a.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
      WHERE r.Id = ?
      ORDER BY p.Nombre ASC
    `;

    return this.rubrosRepository.query(query, [rubroId]);
  }

  async getArticulosPorRubro(
    rubroId: number,
    filtro?: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<{ articulos: any[], total: number }> {

    // Query base - solo artículos que tienen proveedor asociado al rubro
    let baseQuery = `
      FROM mudras_articulos a
      INNER JOIN mudras_rubros r ON a.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
      INNER JOIN mudras_proveedores p ON a.idProveedor = p.IdProveedor
      INNER JOIN mudras_proveedor_rubro pr ON pr.proveedor_id = p.IdProveedor AND pr.rubro_nombre COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
      WHERE r.Id = ?
    `;

    const params: any[] = [rubroId];

    // Agregar filtro si existe
    if (filtro && filtro.trim()) {
      baseQuery += ` AND (a.Codigo LIKE ? OR a.Descripcion LIKE ? OR p.Nombre LIKE ?)`;
      const searchParam = `%${filtro.trim()}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    // Query para contar total
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;

    // Query principal con datos
    const dataQuery = `
      SELECT 
        a.id,
        a.Codigo as codigo,
        a.Descripcion as descripcion,
        a.PrecioVenta as precio,
        a.Stock as stock,
        p.IdProveedor as proveedorId,
        p.Nombre as proveedorNombre
      ${baseQuery}
      ORDER BY a.Codigo ASC
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];

    // Ejecutar ambas queries
    const [articulos, totalResult] = await Promise.all([
      this.rubrosRepository.query(dataQuery, dataParams),
      this.rubrosRepository.query(countQuery, params)
    ]);

    const total = totalResult[0]?.total || 0;

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
      total
    };
  }

  async eliminarProveedorDeRubro(proveedorId: number, rubroNombre: string): Promise<boolean> {
    try {
      // Paso 1: Actualizar artículos que tenían este proveedor en este rubro
      // Los artículos quedan sin proveedor (idProveedor = NULL)
      await this.rubrosRepository.query(
        'UPDATE mudras_articulos SET idProveedor = NULL WHERE idProveedor = ? AND Rubro = ?',
        [proveedorId, rubroNombre]
      );

      // Paso 2: Eliminar de la tabla de relaciones tb_proveedor_rubro
      await this.rubrosRepository.query(
        'DELETE FROM mudras_proveedor_rubro WHERE proveedor_id = ? AND rubro_nombre = ?',
        [proveedorId, rubroNombre]
      );

      // Paso 3: Actualizar tbproveedores si es necesario
      // Solo si el proveedor no tiene más rubros asociados
      const rubrosRestantes = await this.rubrosRepository.query(
        'SELECT COUNT(*) as count FROM mudras_proveedor_rubro WHERE proveedor_id = ?',
        [proveedorId]
      );

      if (rubrosRestantes[0].count === 0) {
        // Si no tiene más rubros, limpiar el campo Rubro en tbproveedores
        await this.rubrosRepository.query(
          'UPDATE mudras_proveedores SET Rubro = NULL WHERE IdProveedor = ?',
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
      const resultString = await this.rubrosRepository.query(
        'UPDATE mudras_articulos SET Rubro = NULL WHERE id = ?',
        [articuloId]
      );

      return resultString.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar artículo del rubro:', error);
      throw new Error('No se pudo eliminar el artículo del rubro');
    }
  }

  async eliminarArticulosDeRubro(articuloIds: number[]): Promise<boolean> {
    try {
      if (articuloIds.length === 0) {
        return false;
      }

      // Crear placeholders para la query IN
      const placeholders = articuloIds.map(() => '?').join(',');

      const resultString = await this.rubrosRepository.query(
        `UPDATE mudras_articulos SET Rubro = NULL WHERE id IN (${placeholders})`,
        articuloIds
      );

      return resultString.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar artículos del rubro:', error);
      throw new Error('No se pudo eliminar los artículos del rubro');
    }
  }
}
