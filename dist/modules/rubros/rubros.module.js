"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubrosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rubros_service_1 = require("./rubros.service");
const rubros_resolver_1 = require("./rubros.resolver");
const rubro_entity_1 = require("./entities/rubro.entity");
let RubrosModule = class RubrosModule {
};
exports.RubrosModule = RubrosModule;
exports.RubrosModule = RubrosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([rubro_entity_1.Rubro])],
        providers: [rubros_resolver_1.RubrosResolver, rubros_service_1.RubrosService],
        exports: [rubros_service_1.RubrosService],
    })
], RubrosModule);
//# sourceMappingURL=rubros.module.js.map