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
exports.ProveedoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const proveedor_entity_1 = require("./entities/proveedor.entity");
let ProveedoresService = class ProveedoresService {
    constructor(proveedoresRepository) {
        this.proveedoresRepository = proveedoresRepository;
    }
    async findAll() {
        return this.proveedoresRepository.find({
            order: { IdProveedor: 'ASC' },
        });
    }
    async findOne(id) {
        const proveedor = await this.proveedoresRepository.findOne({
            where: { IdProveedor: id },
            relations: ['articulos']
        });
        if (!proveedor) {
            throw new common_1.NotFoundException(`Proveedor con ID ${id} no encontrado`);
        }
        return proveedor;
    }
    async findByCodigo(codigo) {
        return this.proveedoresRepository.findOne({
            where: { Codigo: codigo },
        });
    }
    async findByNombre(nombre) {
        return this.proveedoresRepository
            .createQueryBuilder('proveedor')
            .where('proveedor.Nombre LIKE :nombre', { nombre: `%${nombre}%` })
            .getMany();
    }
    async create(createProveedorInput) {
        if (createProveedorInput.Codigo) {
            const existingByCodigo = await this.findByCodigo(createProveedorInput.Codigo);
            if (existingByCodigo) {
                throw new common_1.ConflictException(`Ya existe un proveedor con el código ${createProveedorInput.Codigo}`);
            }
        }
        if (createProveedorInput.Nombre) {
            const existingByNombre = await this.proveedoresRepository.findOne({
                where: { Nombre: createProveedorInput.Nombre }
            });
            if (existingByNombre) {
                throw new common_1.ConflictException(`Ya existe un proveedor con el nombre "${createProveedorInput.Nombre}"`);
            }
        }
        const proveedor = this.proveedoresRepository.create({
            ...createProveedorInput,
            FechaModif: new Date()
        });
        return this.proveedoresRepository.save(proveedor);
    }
    async update(updateProveedorInput) {
        const { IdProveedor, ...updateData } = updateProveedorInput;
        const proveedor = await this.findOne(IdProveedor);
        if (updateData.Codigo && updateData.Codigo !== proveedor.Codigo) {
            const existingByCodigo = await this.findByCodigo(updateData.Codigo);
            if (existingByCodigo && existingByCodigo.IdProveedor !== IdProveedor) {
                throw new common_1.ConflictException(`Ya existe otro proveedor con el código ${updateData.Codigo}`);
            }
        }
        if (updateData.Nombre && updateData.Nombre !== proveedor.Nombre) {
            const existingByNombre = await this.proveedoresRepository.findOne({
                where: { Nombre: updateData.Nombre }
            });
            if (existingByNombre && existingByNombre.IdProveedor !== IdProveedor) {
                throw new common_1.ConflictException(`Ya existe otro proveedor con el nombre "${updateData.Nombre}"`);
            }
        }
        await this.proveedoresRepository.update(IdProveedor, {
            ...updateData,
            FechaModif: new Date()
        });
        return this.findOne(IdProveedor);
    }
    async findArticulosByProveedor(proveedorId, filtro, offset = 0, limit = 50) {
        const proveedor = await this.findOne(proveedorId);
        let query = this.proveedoresRepository
            .createQueryBuilder('proveedor')
            .leftJoinAndSelect('proveedor.articulos', 'articulo')
            .where('proveedor.IdProveedor = :proveedorId', { proveedorId });
        if (filtro) {
            query = query.andWhere('(articulo.Descripcion LIKE :filtro OR articulo.Codigo LIKE :filtro)', { filtro: `%${filtro}%` });
        }
        const [result] = await query.getManyAndCount();
        const articulos = result.length > 0 ? result[0].articulos : [];
        const total = articulos.length;
        const articulosPaginados = articulos.slice(offset, offset + limit);
        return {
            articulos: articulosPaginados.map(articulo => ({
                Id: articulo.id,
                Codigo: articulo.Codigo,
                Descripcion: articulo.Descripcion,
                Stock: 0,
                PrecioVenta: articulo.PrecioVenta,
                Rubro: articulo.Rubro,
                StockMinimo: articulo.StockMinimo,
                EnPromocion: articulo.EnPromocion,
                stock: 0,
                precio: articulo.PrecioVenta || 0,
                rubro: articulo.Rubro
            })),
            total
        };
    }
    async remove(id) {
        const proveedor = await this.findOne(id);
        const articulosCount = await this.proveedoresRepository
            .createQueryBuilder('proveedor')
            .leftJoin('proveedor.articulos', 'articulo')
            .where('proveedor.IdProveedor = :id', { id })
            .getCount();
        if (articulosCount > 0) {
            throw new common_1.ConflictException(`No se puede eliminar el proveedor porque tiene ${articulosCount} artículos asociados`);
        }
        await this.proveedoresRepository.remove(proveedor);
        return true;
    }
    async findRubrosByProveedor(proveedorId) {
        const query = `
      SELECT
        pr.id,
        pr.proveedor_id AS proveedorId,
        pr.proveedor_nombre AS proveedorNombre,
        pr.proveedor_codigo AS proveedorCodigo,
        pr.rubro_nombre AS rubroNombre,
        pr.rubro_id AS rubroId,
        pr.cantidad_articulos AS cantidadArticulos
      FROM mudras_proveedor_rubro pr
      WHERE pr.proveedor_id = ?
      ORDER BY pr.rubro_nombre
    `;
        const rows = await this.proveedoresRepository.query(query, [proveedorId]);
        return rows.map((row) => ({
            id: Number(row.id),
            proveedorId: Number(row.proveedorId ?? row.proveedor_id ?? proveedorId),
            proveedorNombre: row.proveedorNombre ?? row.proveedor_nombre ?? null,
            proveedorCodigo: row.proveedorCodigo != null ? Number(row.proveedorCodigo) : row.proveedor_codigo != null ? Number(row.proveedor_codigo) : null,
            rubroNombre: row.rubroNombre ?? row.rubro_nombre ?? null,
            rubroId: row.rubroId != null ? Number(row.rubroId) : row.rubro_id != null ? Number(row.rubro_id) : null,
            cantidadArticulos: row.cantidadArticulos != null
                ? Number(row.cantidadArticulos)
                : row.cantidad_articulos != null
                    ? Number(row.cantidad_articulos)
                    : null,
        }));
    }
};
exports.ProveedoresService = ProveedoresService;
exports.ProveedoresService = ProveedoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProveedoresService);
//# sourceMappingURL=proveedores.service.js.map