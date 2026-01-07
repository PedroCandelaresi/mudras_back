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
exports.Proveedor = exports.EstadoProveedor = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const cuenta_corriente_entity_1 = require("../../cuentas-corrientes/entities/cuenta-corriente.entity");
const rubro_entity_1 = require("../../rubros/entities/rubro.entity");
const orden_compra_entity_1 = require("../../compras/entities/orden-compra.entity");
var EstadoProveedor;
(function (EstadoProveedor) {
    EstadoProveedor["ACTIVO"] = "activo";
    EstadoProveedor["INACTIVO"] = "inactivo";
    EstadoProveedor["SUSPENDIDO"] = "suspendido";
})(EstadoProveedor || (exports.EstadoProveedor = EstadoProveedor = {}));
(0, graphql_1.registerEnumType)(EstadoProveedor, {
    name: 'EstadoProveedor',
    description: 'Estados disponibles para proveedores',
});
let Proveedor = class Proveedor {
};
exports.Proveedor = Proveedor;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proveedor.prototype, "IdProveedor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Proveedor.prototype, "Codigo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Nombre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Contacto", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Direccion", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Localidad", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Provincia", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "CP", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Telefono", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Celular", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'smallint', nullable: true }),
    __metadata("design:type", Number)
], Proveedor.prototype, "TipoIva", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 14, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "CUIT", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Observaciones", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Web", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Mail", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Rubro", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Proveedor.prototype, "rubroId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Proveedor.prototype, "Saldo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Proveedor.prototype, "PorcentajeRecargoProveedor", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Proveedor.prototype, "PorcentajeDescuentoProveedor", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Pais", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "Fax", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Proveedor.prototype, "FechaModif", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => articulo_entity_1.Articulo, articulo => articulo.proveedor),
    (0, graphql_1.Field)(() => [articulo_entity_1.Articulo], { nullable: true }),
    __metadata("design:type", Array)
], Proveedor.prototype, "articulos", void 0);
__decorate([
    (0, graphql_1.Field)(() => rubro_entity_1.Rubro, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => rubro_entity_1.Rubro, rubro => rubro.proveedores, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)({ name: 'rubroId' }),
    __metadata("design:type", rubro_entity_1.Rubro)
], Proveedor.prototype, "rubro", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cuenta_corriente_entity_1.CuentaCorriente, cuentaCorriente => cuentaCorriente.proveedor),
    (0, graphql_1.Field)(() => [cuenta_corriente_entity_1.CuentaCorriente], { nullable: true }),
    __metadata("design:type", Array)
], Proveedor.prototype, "cuentasCorrientes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orden_compra_entity_1.OrdenCompra, (oc) => oc.proveedor),
    (0, graphql_1.Field)(() => [orden_compra_entity_1.OrdenCompra], { nullable: true }),
    __metadata("design:type", Array)
], Proveedor.prototype, "ordenesCompra", void 0);
exports.Proveedor = Proveedor = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('mudras_proveedores')
], Proveedor);
//# sourceMappingURL=proveedor.entity.js.map