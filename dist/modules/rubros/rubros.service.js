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
    async findAll() {
        return this.rubrosRepository.find({
            order: { Id: 'ASC' },
        });
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
};
exports.RubrosService = RubrosService;
exports.RubrosService = RubrosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rubro_entity_1.Rubro)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RubrosService);
//# sourceMappingURL=rubros.service.js.map