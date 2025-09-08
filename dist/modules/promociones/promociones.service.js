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
exports.PromocionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promocion_entity_1 = require("./entities/promocion.entity");
let PromocionesService = class PromocionesService {
    constructor(repo) {
        this.repo = repo;
    }
    async listar() {
        return this.repo.find({ order: { inicio: 'DESC' } });
    }
    async crear(input) {
        const estado = input.estado ?? promocion_entity_1.EstadoPromocion.PROGRAMADA;
        const entity = this.repo.create({ ...input, estado });
        return this.repo.save(entity);
    }
    async actualizar(id, input) {
        const prom = await this.repo.findOne({ where: { id } });
        if (!prom)
            throw new common_1.NotFoundException('Promoción no encontrada');
        Object.assign(prom, input);
        return this.repo.save(prom);
    }
    async eliminar(id) {
        const prom = await this.repo.findOne({ where: { id } });
        if (!prom)
            throw new common_1.NotFoundException('Promoción no encontrada');
        await this.repo.remove(prom);
        return true;
    }
};
exports.PromocionesService = PromocionesService;
exports.PromocionesService = PromocionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promocion_entity_1.Promocion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PromocionesService);
//# sourceMappingURL=promociones.service.js.map