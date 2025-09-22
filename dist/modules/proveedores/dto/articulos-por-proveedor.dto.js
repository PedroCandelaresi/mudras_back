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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticulosPorProveedorResponse = exports.ArticuloProveedor = void 0;
const graphql_1 = require("@nestjs/graphql");
let ArticuloProveedor = class ArticuloProveedor {
};
exports.ArticuloProveedor = ArticuloProveedor;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticuloProveedor.prototype, "Id", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ArticuloProveedor.prototype, "Codigo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloProveedor.prototype, "Descripcion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ArticuloProveedor.prototype, "Deposito", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ArticuloProveedor.prototype, "PrecioVenta", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ArticuloProveedor.prototype, "Rubro", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ArticuloProveedor.prototype, "StockMinimo", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], ArticuloProveedor.prototype, "EnPromocion", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticuloProveedor.prototype, "stock", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticuloProveedor.prototype, "precio", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ArticuloProveedor.prototype, "rubro", void 0);
exports.ArticuloProveedor = ArticuloProveedor = __decorate([
    (0, graphql_1.ObjectType)()
], ArticuloProveedor);
let ArticulosPorProveedorResponse = class ArticulosPorProveedorResponse {
};
exports.ArticulosPorProveedorResponse = ArticulosPorProveedorResponse;
__decorate([
    (0, graphql_1.Field)(() => [ArticuloProveedor]),
    __metadata("design:type", Array)
], ArticulosPorProveedorResponse.prototype, "articulos", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ArticulosPorProveedorResponse.prototype, "total", void 0);
exports.ArticulosPorProveedorResponse = ArticulosPorProveedorResponse = __decorate([
    (0, graphql_1.ObjectType)()
], ArticulosPorProveedorResponse);
//# sourceMappingURL=articulos-por-proveedor.dto.js.map