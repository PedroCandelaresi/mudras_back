"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
const date_scalar_1 = require("./common/scalars/date.scalar");
const articulos_module_1 = require("./modules/articulos/articulos.module");
const proveedores_module_1 = require("./modules/proveedores/proveedores.module");
const stock_module_1 = require("./modules/stock/stock.module");
const rubros_module_1 = require("./modules/rubros/rubros.module");
const articulo_entity_1 = require("./modules/articulos/entities/articulo.entity");
const proveedor_entity_1 = require("./modules/proveedores/entities/proveedor.entity");
const stock_entity_1 = require("./modules/stock/entities/stock.entity");
const rubro_entity_1 = require("./modules/rubros/entities/rubro.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'mudras',
                password: 'mudras2025',
                database: 'mudras',
                entities: [articulo_entity_1.Articulo, proveedor_entity_1.Proveedor, stock_entity_1.Stock, rubro_entity_1.Rubro],
                synchronize: false,
                logging: true,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                playground: true,
                introspection: true,
            }),
            articulos_module_1.ArticulosModule,
            proveedores_module_1.ProveedoresModule,
            stock_module_1.StockModule,
            rubros_module_1.RubrosModule,
        ],
        providers: [date_scalar_1.DateTimeScalar],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map