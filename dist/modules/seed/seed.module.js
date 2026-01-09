"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seed_service_1 = require("./seed.service");
const user_entity_1 = require("../users-auth/entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const user_role_entity_1 = require("../users-auth/entities/user-role.entity");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
const usuario_auth_map_entity_1 = require("../users-auth/entities/usuario-auth-map.entity");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const rubro_entity_1 = require("../rubros/entities/rubro.entity");
const proveedor_entity_1 = require("../proveedores/entities/proveedor.entity");
const punto_mudras_entity_1 = require("../puntos-mudras/entities/punto-mudras.entity");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserAuth,
                role_entity_1.Role,
                user_role_entity_1.UserRole,
                usuario_entity_1.Usuario,
                usuario_auth_map_entity_1.UsuarioAuthMap,
                articulo_entity_1.Articulo,
                rubro_entity_1.Rubro,
                proveedor_entity_1.Proveedor,
                punto_mudras_entity_1.PuntoMudras,
            ]),
        ],
        providers: [seed_service_1.SeedService],
        exports: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map