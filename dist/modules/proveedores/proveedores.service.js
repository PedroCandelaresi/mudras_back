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
const rubro_entity_1 = require("../rubros/entities/rubro.entity");
const proveedor_rubro_entity_1 = require("./entities/proveedor-rubro.entity");
const typeorm_3 = require("typeorm");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const articulos_service_1 = require("../articulos/articulos.service");
let ProveedoresService = class ProveedoresService {
    constructor(proveedoresRepository, rubrosRepository, proveedorRubrosRepository, articulosService) {
        this.proveedoresRepository = proveedoresRepository;
        this.rubrosRepository = rubrosRepository;
        this.proveedorRubrosRepository = proveedorRubrosRepository;
        this.articulosService = articulosService;
    }
    async findAll() {
        return this.proveedoresRepository.find({
            order: { IdProveedor: 'ASC' },
        });
    }
    async findOne(id) {
        const proveedor = await this.proveedoresRepository.findOne({
            where: { IdProveedor: id },
            relations: ['articulos', 'proveedorRubros', 'proveedorRubros.rubro']
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
        const { rubrosIds, ...createData } = createProveedorInput;
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
            ...createData,
            FechaModif: new Date(),
        });
        const savedProveedor = await this.proveedoresRepository.save(proveedor);
        if (rubrosIds && rubrosIds.length > 0) {
            const newRelations = rubrosIds.map(rubroId => this.proveedorRubrosRepository.create({
                proveedorId: savedProveedor.IdProveedor,
                rubroId: rubroId,
                porcentajeRecargo: 0,
                porcentajeDescuento: 0
            }));
            await this.proveedorRubrosRepository.save(newRelations);
        }
        return this.findOne(savedProveedor.IdProveedor);
    }
    async update(updateProveedorInput) {
        const { IdProveedor, rubrosIds, ...updateData } = updateProveedorInput;
        const proveedor = await this.proveedoresRepository.findOne({
            where: { IdProveedor },
            relations: ['proveedorRubros']
        });
        if (!proveedor) {
            throw new common_1.NotFoundException(`Proveedor con ID ${IdProveedor} no encontrado`);
        }
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
        Object.assign(proveedor, {
            ...updateData,
            FechaModif: new Date(),
        });
        await this.proveedoresRepository.save(proveedor);
        if (rubrosIds !== undefined) {
            const currentRubrosIds = proveedor.proveedorRubros?.map(pr => pr.rubroId) || [];
            const toAdd = rubrosIds.filter(id => !currentRubrosIds.includes(id));
            const toRemove = currentRubrosIds.filter(id => !rubrosIds.includes(id));
            if (toRemove.length > 0) {
                await this.proveedorRubrosRepository.delete({
                    proveedorId: IdProveedor,
                    rubroId: (0, typeorm_3.In)(toRemove)
                });
            }
            if (toAdd.length > 0) {
                const newRelations = toAdd.map(rubroId => this.proveedorRubrosRepository.create({
                    proveedorId: IdProveedor,
                    rubroId: rubroId,
                    porcentajeRecargo: 0,
                    porcentajeDescuento: 0
                }));
                await this.proveedorRubrosRepository.save(newRelations);
            }
        }
        return this.findOne(IdProveedor);
    }
    async configurarRubroProveedor(proveedorId, rubroId, recargo, descuento) {
        let relacion = await this.proveedorRubrosRepository.findOne({
            where: { proveedorId, rubroId }
        });
        if (!relacion) {
            relacion = this.proveedorRubrosRepository.create({
                proveedorId,
                rubroId,
                porcentajeRecargo: recargo,
                porcentajeDescuento: descuento
            });
        }
        else {
            relacion.porcentajeRecargo = recargo;
            relacion.porcentajeDescuento = descuento;
        }
        const saved = await this.proveedorRubrosRepository.save(relacion);
        await this.articulosService.recalcularePreciosPorProveedorRubro(proveedorId, rubroId, recargo, descuento);
        return saved;
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
        await this.proveedoresRepository.manager.update(articulo_entity_1.Articulo, { idProveedor: id }, { idProveedor: null });
        await this.proveedoresRepository.remove(proveedor);
        return true;
    }
    async findRubrosByProveedor(proveedorId) {
        const relaciones = await this.proveedorRubrosRepository.find({
            where: { proveedorId },
            relations: ['rubro']
        });
        return relaciones.map(pr => ({
            proveedorId: pr.proveedorId,
            proveedorNombre: pr.proveedor?.Nombre || '',
            proveedorCodigo: null,
            rubroNombre: pr.rubro?.Rubro || '',
            rubroId: pr.rubroId,
            cantidadArticulos: 0,
            porcentajeRecargo: pr.porcentajeRecargo,
            porcentajeDescuento: pr.porcentajeDescuento
        }));
    }
};
exports.ProveedoresService = ProveedoresService;
exports.ProveedoresService = ProveedoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __param(1, (0, typeorm_1.InjectRepository)(rubro_entity_1.Rubro)),
    __param(2, (0, typeorm_1.InjectRepository)(proveedor_rubro_entity_1.ProveedorRubro)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        articulos_service_1.ArticulosService])
], ProveedoresService);
//# sourceMappingURL=proveedores.service.js.map