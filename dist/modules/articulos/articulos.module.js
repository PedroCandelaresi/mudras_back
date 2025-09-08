"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticulosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const articulos_service_1 = require("./articulos.service");
const articulos_resolver_1 = require("./articulos.resolver");
const articulo_entity_1 = require("./entities/articulo.entity");
const auth_module_1 = require("../auth/auth.module");
let ArticulosModule = class ArticulosModule {
};
exports.ArticulosModule = ArticulosModule;
exports.ArticulosModule = ArticulosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([articulo_entity_1.Articulo]), auth_module_1.AuthModule],
        providers: [articulos_resolver_1.ArticulosResolver, articulos_service_1.ArticulosService],
        exports: [articulos_service_1.ArticulosService],
    })
], ArticulosModule);
//# sourceMappingURL=articulos.module.js.map