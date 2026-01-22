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
exports.RubrosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rubro_entity_1 = require("./entities/rubro.entity");
let RubrosService = class RubrosService {
    constructor(rubrosRepository) {
        this.rubrosRepository = rubrosRepository;
    }
    async findAll(pagina = 0, limite = 50, busqueda) {
        const offset = pagina * limite;
        let countQuery = `
      SELECT COUNT(DISTINCT r.Id) as total
      FROM mudras_rubros r
    `;
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
        INNER JOIN mudras_proveedores_rubros pr ON pr.proveedorId = p.IdProveedor 
        INNER JOIN mudras_rubros r_link ON pr.rubroId = r_link.Id
        WHERE r_link.Rubro COLLATE utf8mb4_unicode_ci = a.Rubro COLLATE utf8mb4_unicode_ci
      ) a ON a.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
      LEFT JOIN mudras_proveedores p ON a.idProveedor = p.IdProveedor
    `;
        const params = [];
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
        const [rubros, totalResult] = await Promise.all([
            this.rubrosRepository.query(query, params),
            this.rubrosRepository.query(countQuery, busqueda && busqueda.trim() ? params.slice(0, -2) : [])
        ]);
        const total = totalResult[0]?.total || 0;
        return { rubros, total };
    }
    async findOne(id) {
        return this.rubrosRepository.findOne({
            where: { Id: id },
        });
    }
    async findByNombre(rubro) {
        return this.rubrosRepository.findOne({
            where: { Rubro: rubro },
        });
    }
    async create(nombre, codigo, porcentajeRecargo, porcentajeDescuento, unidadMedida) {
        const nuevoRubro = this.rubrosRepository.create({
            Rubro: nombre,
            Codigo: codigo || null,
            PorcentajeRecargo: porcentajeRecargo ?? 0,
            PorcentajeDescuento: porcentajeDescuento ?? 0,
            unidadMedida: unidadMedida || 'Unidad'
        });
        return await this.rubrosRepository.save(nuevoRubro);
    }
    async update(id, nombre, codigo, porcentajeRecargo, porcentajeDescuento, unidadMedida) {
        await this.rubrosRepository.update(id, {
            Rubro: nombre,
            Codigo: codigo || null,
            PorcentajeRecargo: porcentajeRecargo ?? 0,
            PorcentajeDescuento: porcentajeDescuento ?? 0,
            unidadMedida: unidadMedida
        });
        return this.findOne(id);
    }
    async remove(id) {
        await this.rubrosRepository.query('UPDATE mudras_articulos SET Rubro = NULL, rubroId = NULL WHERE rubroId = ? OR Rubro = (SELECT Rubro FROM mudras_rubros WHERE Id = ?)', [id, id]);
        const result = await this.rubrosRepository.delete(id);
        return result.affected > 0;
    }
    async getProveedoresPorRubro(rubroId) {
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
    async getArticulosPorRubro(rubroId, filtro, offset = 0, limit = 50) {
        let baseQuery = `
      FROM mudras_articulos a
      INNER JOIN mudras_rubros r ON a.Rubro COLLATE utf8mb4_unicode_ci = r.Rubro COLLATE utf8mb4_unicode_ci
      INNER JOIN mudras_proveedores p ON a.idProveedor = p.IdProveedor
      INNER JOIN mudras_proveedores_rubros pr ON pr.proveedorId = p.IdProveedor AND pr.rubroId = r.Id
      WHERE r.Id = ?
    `;
        const params = [rubroId];
        if (filtro && filtro.trim()) {
            baseQuery += ` AND (a.Codigo LIKE ? OR a.Descripcion LIKE ? OR p.Nombre LIKE ?)`;
            const searchParam = `%${filtro.trim()}%`;
            params.push(searchParam, searchParam, searchParam);
        }
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
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
        const [articulos, totalResult] = await Promise.all([
            this.rubrosRepository.query(dataQuery, dataParams),
            this.rubrosRepository.query(countQuery, params)
        ]);
        const total = totalResult[0]?.total || 0;
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
    async eliminarProveedorDeRubro(proveedorId, rubroNombre) {
        try {
            await this.rubrosRepository.query('UPDATE mudras_articulos SET idProveedor = NULL WHERE idProveedor = ? AND Rubro = ?', [proveedorId, rubroNombre]);
            const rubro = await this.rubrosRepository.findOne({ where: { Rubro: rubroNombre } });
            if (rubro) {
                await this.rubrosRepository.query('DELETE FROM mudras_proveedores_rubros WHERE proveedorId = ? AND rubroId = ?', [proveedorId, rubro.Id]);
            }
            const rubrosRestantes = await this.rubrosRepository.query('SELECT COUNT(*) as count FROM mudras_proveedores_rubros WHERE proveedorId = ?', [proveedorId]);
            if (rubrosRestantes[0].count === 0) {
                await this.rubrosRepository.query('UPDATE mudras_proveedores SET Rubro = NULL WHERE IdProveedor = ?', [proveedorId]);
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
            const resultString = await this.rubrosRepository.query('UPDATE mudras_articulos SET Rubro = NULL WHERE id = ?', [articuloId]);
            return resultString.affectedRows > 0;
        }
        catch (error) {
            console.error('Error al eliminar artículo del rubro:', error);
            throw new Error('No se pudo eliminar el artículo del rubro');
        }
    }
    async eliminarArticulosDeRubro(articuloIds) {
        try {
            if (articuloIds.length === 0) {
                return false;
            }
            const placeholders = articuloIds.map(() => '?').join(',');
            const resultString = await this.rubrosRepository.query(`UPDATE mudras_articulos SET Rubro = NULL WHERE id IN (${placeholders})`, articuloIds);
            return resultString.affectedRows > 0;
        }
        catch (error) {
            console.error('Error al eliminar artículos del rubro:', error);
            throw new Error('No se pudo eliminar los artículos del rubro');
        }
    }
};
exports.RubrosService = RubrosService;
exports.RubrosService = RubrosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rubro_entity_1.Rubro)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RubrosService);
//# sourceMappingURL=rubros.service.js.map