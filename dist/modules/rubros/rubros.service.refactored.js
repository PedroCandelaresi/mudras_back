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
exports.RubrosServiceRefactored = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rubro_entity_1 = require("./entities/rubro.entity");
const database_service_1 = require("../../common/database/database.service");
let RubrosServiceRefactored = class RubrosServiceRefactored {
    constructor(rubrosRepository, databaseService) {
        this.rubrosRepository = rubrosRepository;
        this.databaseService = databaseService;
        this.QUERIES = {
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
        a.Stock as stock,
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
    }
    async findAll(pagina = 0, limite = 50, busqueda) {
        const offset = pagina * limite;
        const { whereClause, params } = this.databaseService.buildWhereConditions({ search: busqueda }, ['r.Rubro', 'r.Codigo']);
        const baseQuery = `${this.QUERIES.BASE_RUBROS_CON_ESTADISTICAS} ${whereClause} GROUP BY r.Id, r.Rubro, r.Codigo, r.PorcentajeRecargo, r.PorcentajeDescuento`;
        const { query: dataQuery, params: dataParams } = this.databaseService.buildPaginationQuery(baseQuery, params, offset, limite, 'r.Rubro ASC');
        const countQuery = this.databaseService.buildCountQuery(baseQuery);
        const [rubros, totalResult] = await Promise.all([
            this.databaseService.executeQuery(dataQuery, dataParams),
            this.databaseService.executeQuery(countQuery, params)
        ]);
        return {
            rubros,
            total: totalResult[0]?.total || 0
        };
    }
    async findOne(id) {
        const query = `${this.QUERIES.BASE_RUBROS} WHERE r.Id = ?`;
        const result = await this.databaseService.executeQuery(query, [id]);
        return result[0] || null;
    }
    async findByNombre(rubro) {
        const query = `${this.QUERIES.BASE_RUBROS} WHERE r.Rubro = ?`;
        const result = await this.databaseService.executeQuery(query, [rubro]);
        return result[0] || null;
    }
    async create(nombre, codigo, porcentajeRecargo, porcentajeDescuento) {
        const nuevoRubro = this.rubrosRepository.create({
            Rubro: nombre,
            Codigo: codigo || null,
            PorcentajeRecargo: porcentajeRecargo || 0,
            PorcentajeDescuento: porcentajeDescuento || 0
        });
        return await this.rubrosRepository.save(nuevoRubro);
    }
    async update(id, nombre, codigo, porcentajeRecargo, porcentajeDescuento) {
        await this.rubrosRepository.update(id, {
            Rubro: nombre,
            Codigo: codigo || null,
            PorcentajeRecargo: porcentajeRecargo || 0,
            PorcentajeDescuento: porcentajeDescuento || 0
        });
        return this.findOne(id);
    }
    async remove(id) {
        const articulosCount = await this.databaseService.executeQuery('SELECT COUNT(*) as count FROM tbarticulos WHERE Rubro = (SELECT Rubro FROM tbrubros WHERE Id = ?)', [id]);
        if (articulosCount[0].count > 0) {
            throw new Error('No se puede eliminar el rubro porque tiene artículos asociados');
        }
        const result = await this.rubrosRepository.delete(id);
        return result.affected > 0;
    }
    async getProveedoresPorRubro(rubroId) {
        return this.databaseService.executeQuery(`${this.QUERIES.PROVEEDORES_POR_RUBRO} ORDER BY p.Nombre ASC`, [rubroId]);
    }
    async getArticulosPorRubro(rubroId, filtro, offset = 0, limit = 50) {
        const { whereClause, params } = this.databaseService.buildWhereConditions({ search: filtro }, ['a.Codigo', 'a.Descripcion', 'p.Nombre']);
        const baseQuery = `${this.QUERIES.ARTICULOS_POR_RUBRO} ${whereClause}`;
        const baseParams = [rubroId, ...params];
        const { query: dataQuery, params: dataParams } = this.databaseService.buildPaginationQuery(baseQuery, baseParams, offset, limit, 'a.Codigo ASC');
        const countQuery = this.databaseService.buildCountQuery(baseQuery);
        const [articulos, totalResult] = await Promise.all([
            this.databaseService.executeQuery(dataQuery, dataParams),
            this.databaseService.executeQuery(countQuery, baseParams)
        ]);
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
    async eliminarProveedorDeRubro(proveedorId, rubroNombre) {
        try {
            const transacciones = this.QUERIES.ELIMINAR_PROVEEDOR_TRANSACCION.map(({ query }) => ({
                query,
                params: [proveedorId, rubroNombre]
            }));
            await this.databaseService.executeTransaction(transacciones);
            const rubrosRestantes = await this.databaseService.executeQuery('SELECT COUNT(*) as count FROM tb_proveedor_rubro WHERE proveedor_id = ?', [proveedorId]);
            if (rubrosRestantes[0].count === 0) {
                await this.databaseService.executeQuery('UPDATE tbproveedores SET Rubro = NULL WHERE IdProveedor = ?', [proveedorId]);
            }
            return true;
        }
        catch (error) {
            console.error('Error al eliminar proveedor del rubro:', error);
            throw new Error('No se pudo eliminar el proveedor del rubro');
        }
    }
    async eliminarArticuloDeRubro(articuloId) {
        try {
            const result = await this.databaseService.executeQuery('UPDATE tbarticulos SET Rubro = NULL WHERE id = ?', [articuloId]);
            return Array.isArray(result) ? result.length > 0 : result.affectedRows > 0;
        }
        catch (error) {
            console.error('Error al eliminar artículo del rubro:', error);
            throw new Error('No se pudo eliminar el artículo del rubro');
        }
    }
    async eliminarArticulosDeRubro(articuloIds) {
        if (articuloIds.length === 0) {
            return false;
        }
        try {
            const placeholders = articuloIds.map(() => '?').join(',');
            const result = await this.databaseService.executeQuery(`UPDATE tbarticulos SET Rubro = NULL WHERE id IN (${placeholders})`, articuloIds);
            return Array.isArray(result) ? result.length > 0 : result.affectedRows > 0;
        }
        catch (error) {
            console.error('Error al eliminar artículos del rubro:', error);
            throw new Error('No se pudo eliminar los artículos del rubro');
        }
    }
    async getEstadisticasRubro(rubroId) {
        const query = `
      SELECT 
        COUNT(DISTINCT a.id) as totalArticulos,
        COUNT(DISTINCT pr.proveedor_id) as totalProveedores,
        AVG(a.PrecioVenta) as precioPromedio,
        SUM(a.Stock) as stockTotal
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
};
exports.RubrosServiceRefactored = RubrosServiceRefactored;
exports.RubrosServiceRefactored = RubrosServiceRefactored = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rubro_entity_1.Rubro)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        database_service_1.DatabaseService])
], RubrosServiceRefactored);
//# sourceMappingURL=rubros.service.refactored.js.map