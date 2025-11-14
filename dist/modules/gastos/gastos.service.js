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
exports.GastosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gasto_entity_1 = require("./entities/gasto.entity");
const categoria_gasto_entity_1 = require("./entities/categoria-gasto.entity");
let GastosService = class GastosService {
    constructor(gastoRepo, categoriaRepo) {
        this.gastoRepo = gastoRepo;
        this.categoriaRepo = categoriaRepo;
    }
    async listar(desde, hasta, categoriaId, proveedorId) {
        const qb = this.gastoRepo.createQueryBuilder('gasto').leftJoinAndSelect('gasto.categoria', 'categoria').leftJoinAndSelect('gasto.proveedor', 'proveedor');
        if (desde)
            qb.andWhere('gasto.fecha >= :desde', { desde });
        if (hasta)
            qb.andWhere('gasto.fecha <= :hasta', { hasta });
        if (categoriaId)
            qb.andWhere('gasto.categoriaId = :categoriaId', { categoriaId });
        if (proveedorId)
            qb.andWhere('gasto.proveedorId = :proveedorId', { proveedorId });
        return qb.orderBy('gasto.fecha', 'DESC').getMany();
    }
    async crear(input) {
        const alic = input.alicuotaIva ?? 0;
        const ivaMonto = alic > 0 ? (input.montoNeto * alic) / 100 : 0;
        const total = input.montoNeto + ivaMonto;
        const gasto = this.gastoRepo.create({
            fecha: new Date(input.fecha),
            montoNeto: input.montoNeto,
            alicuotaIva: alic || null,
            montoIva: ivaMonto,
            total,
            descripcion: input.descripcion,
            proveedorId: input.proveedorId,
            categoriaId: input.categoriaId,
        });
        return this.gastoRepo.save(gasto);
    }
    async actualizar(input) {
        const gasto = await this.gastoRepo.findOne({ where: { id: input.id } });
        if (!gasto)
            throw new common_1.NotFoundException('Gasto no encontrado');
        const next = { ...gasto, ...input };
        if (input.fecha)
            next.fecha = new Date(input.fecha);
        const alic = input.alicuotaIva != null ? input.alicuotaIva : next.alicuotaIva ?? 0;
        const neto = input.montoNeto != null ? input.montoNeto : next.montoNeto;
        const ivaMonto = alic > 0 ? (neto * alic) / 100 : 0;
        next.montoIva = ivaMonto;
        next.total = neto + ivaMonto;
        await this.gastoRepo.update(input.id, next);
        return this.gastoRepo.findOne({ where: { id: input.id }, relations: ['categoria', 'proveedor'] });
    }
    async eliminar(id) {
        await this.gastoRepo.delete(id);
        return true;
    }
    async crearCategoria(input) {
        const cat = this.categoriaRepo.create({ ...input });
        return this.categoriaRepo.save(cat);
    }
    async listarCategorias() {
        return this.categoriaRepo.find({ order: { nombre: 'ASC' } });
    }
};
exports.GastosService = GastosService;
exports.GastosService = GastosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gasto_entity_1.Gasto)),
    __param(1, (0, typeorm_1.InjectRepository)(categoria_gasto_entity_1.CategoriaGasto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], GastosService);
//# sourceMappingURL=gastos.service.js.map