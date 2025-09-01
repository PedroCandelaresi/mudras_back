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
exports.ArticulosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const articulo_entity_1 = require("./entities/articulo.entity");
let ArticulosService = class ArticulosService {
    constructor(articulosRepository) {
        this.articulosRepository = articulosRepository;
    }
    async findAll() {
        return this.articulosRepository.find({
            relations: ['proveedor'],
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        return this.articulosRepository.findOne({
            where: { id },
            relations: ['proveedor'],
        });
    }
    async findByCodigo(codigo) {
        return this.articulosRepository.findOne({
            where: { Codigo: codigo },
            relations: ['proveedor'],
        });
    }
    async findByRubro(rubro) {
        return this.articulosRepository.find({
            where: { Rubro: rubro },
            relations: ['proveedor'],
            order: { Descripcion: 'ASC' },
        });
    }
    async findByDescripcion(descripcion) {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Descripcion LIKE :descripcion', { descripcion: `%${descripcion}%` })
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findByProveedor(idProveedor) {
        return this.articulosRepository.find({
            where: { idProveedor },
            relations: ['proveedor'],
            order: { Descripcion: 'ASC' },
        });
    }
    async findConStock() {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Stock > 0')
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findSinStock() {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Stock <= 0 OR articulo.Stock IS NULL')
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findStockBajo() {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Stock <= articulo.StockMinimo AND articulo.StockMinimo > 0')
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findEnPromocion() {
        return this.articulosRepository.find({
            where: { EnPromocion: true },
            relations: ['proveedor'],
            order: { Descripcion: 'ASC' },
        });
    }
};
exports.ArticulosService = ArticulosService;
exports.ArticulosService = ArticulosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticulosService);
//# sourceMappingURL=articulos.service.js.map