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
exports.RubrosResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const rubros_service_1 = require("./rubros.service");
const rubro_entity_1 = require("./entities/rubro.entity");
let RubrosResolver = class RubrosResolver {
    constructor(rubrosService) {
        this.rubrosService = rubrosService;
    }
    findAll() {
        return this.rubrosService.findAll();
    }
    findOne(id) {
        return this.rubrosService.findOne(id);
    }
    findByNombre(rubro) {
        return this.rubrosService.findByNombre(rubro);
    }
};
exports.RubrosResolver = RubrosResolver;
__decorate([
    (0, graphql_1.Query)(() => [rubro_entity_1.Rubro], { name: 'rubros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RubrosResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => rubro_entity_1.Rubro, { name: 'rubro' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RubrosResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => rubro_entity_1.Rubro, { name: 'rubroPorNombre' }),
    __param(0, (0, graphql_1.Args)('rubro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RubrosResolver.prototype, "findByNombre", null);
exports.RubrosResolver = RubrosResolver = __decorate([
    (0, graphql_1.Resolver)(() => rubro_entity_1.Rubro),
    __metadata("design:paramtypes", [rubros_service_1.RubrosService])
], RubrosResolver);
//# sourceMappingURL=rubros.resolver.js.map