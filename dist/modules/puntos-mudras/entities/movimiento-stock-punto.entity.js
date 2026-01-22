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
exports.MovimientoStockPunto = exports.TipoMovimientoStockPunto = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const punto_mudras_entity_1 = require("./punto-mudras.entity");
const articulo_entity_1 = require("../../articulos/entities/articulo.entity");
const usuario_entity_1 = require("../../usuarios/entities/usuario.entity");
var TipoMovimientoStockPunto;
(function (TipoMovimientoStockPunto) {
    TipoMovimientoStockPunto["ENTRADA"] = "entrada";
    TipoMovimientoStockPunto["SALIDA"] = "salida";
    TipoMovimientoStockPunto["TRANSFERENCIA"] = "transferencia";
    TipoMovimientoStockPunto["AJUSTE"] = "ajuste";
    TipoMovimientoStockPunto["VENTA"] = "venta";
    TipoMovimientoStockPunto["DEVOLUCION"] = "devolucion";
})(TipoMovimientoStockPunto || (exports.TipoMovimientoStockPunto = TipoMovimientoStockPunto = {}));
(0, graphql_1.registerEnumType)(TipoMovimientoStockPunto, {
    name: 'TipoMovimientoStockPunto',
    description: 'Tipo de movimiento de stock entre puntos'
});
let MovimientoStockPunto = class MovimientoStockPunto {
};
exports.MovimientoStockPunto = MovimientoStockPunto;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'punto_mudras_origen_id', nullable: true }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "puntoMudrasOrigenId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'punto_mudras_destino_id', nullable: true }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "puntoMudrasDestinoId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, typeorm_1.Column)({ name: 'articulo_id' }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "articuloId", void 0);
__decorate([
    (0, graphql_1.Field)(() => TipoMovimientoStockPunto),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMovimientoStockPunto,
        name: 'tipo_movimiento'
    }),
    __metadata("design:type", String)
], MovimientoStockPunto.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "cantidad", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cantidad_anterior' }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "cantidadAnterior", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'cantidad_nueva' }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "cantidadNueva", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], MovimientoStockPunto.prototype, "motivo", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'referencia_externa' }),
    __metadata("design:type", String)
], MovimientoStockPunto.prototype, "referenciaExterna", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ name: 'usuario_id', nullable: true }),
    __metadata("design:type", Number)
], MovimientoStockPunto.prototype, "usuarioId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_movimiento' }),
    __metadata("design:type", Date)
], MovimientoStockPunto.prototype, "fechaMovimiento", void 0);
__decorate([
    (0, graphql_1.Field)(() => punto_mudras_entity_1.PuntoMudras, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => punto_mudras_entity_1.PuntoMudras, punto => punto.movimientosOrigen, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'punto_mudras_origen_id' }),
    __metadata("design:type", punto_mudras_entity_1.PuntoMudras)
], MovimientoStockPunto.prototype, "puntoOrigen", void 0);
__decorate([
    (0, graphql_1.Field)(() => punto_mudras_entity_1.PuntoMudras, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => punto_mudras_entity_1.PuntoMudras, punto => punto.movimientosDestino, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'punto_mudras_destino_id' }),
    __metadata("design:type", punto_mudras_entity_1.PuntoMudras)
], MovimientoStockPunto.prototype, "puntoDestino", void 0);
__decorate([
    (0, graphql_1.Field)(() => articulo_entity_1.Articulo, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => articulo_entity_1.Articulo),
    (0, typeorm_1.JoinColumn)({ name: 'articulo_id' }),
    __metadata("design:type", articulo_entity_1.Articulo)
], MovimientoStockPunto.prototype, "articulo", void 0);
__decorate([
    (0, graphql_1.Field)(() => usuario_entity_1.Usuario, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], MovimientoStockPunto.prototype, "usuario", void 0);
exports.MovimientoStockPunto = MovimientoStockPunto = __decorate([
    (0, graphql_1.ObjectType)('MovimientoStockPunto'),
    (0, typeorm_1.Entity)('movimientos_stock_puntos')
], MovimientoStockPunto);
//# sourceMappingURL=movimiento-stock-punto.entity.js.map