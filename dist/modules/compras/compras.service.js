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
exports.ComprasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const orden_compra_entity_1 = require("./entities/orden-compra.entity");
const detalle_orden_compra_entity_1 = require("./entities/detalle-orden-compra.entity");
const articulo_entity_1 = require("../articulos/entities/articulo.entity");
const stock_punto_mudras_entity_1 = require("../puntos-mudras/entities/stock-punto-mudras.entity");
let ComprasService = class ComprasService {
    constructor(ordenRepo, detalleRepo, articuloRepo, stockPuntoRepo) {
        this.ordenRepo = ordenRepo;
        this.detalleRepo = detalleRepo;
        this.articuloRepo = articuloRepo;
        this.stockPuntoRepo = stockPuntoRepo;
    }
    async crearOrden(dto) {
        const orden = this.ordenRepo.create({ proveedorId: dto.proveedorId, observaciones: dto.observaciones, estado: orden_compra_entity_1.EstadoOrdenCompra.BORRADOR });
        return this.ordenRepo.save(orden);
    }
    async agregarDetalle(dto) {
        const orden = await this.ordenRepo.findOne({ where: { id: dto.ordenId } });
        if (!orden)
            throw new common_1.NotFoundException('Orden no encontrada');
        if (orden.estado !== orden_compra_entity_1.EstadoOrdenCompra.BORRADOR)
            throw new common_1.BadRequestException('Solo se pueden agregar detalles en BORRADOR');
        const detalle = this.detalleRepo.create({ ...dto });
        return this.detalleRepo.save(detalle);
    }
    async eliminarDetalle(id) {
        const det = await this.detalleRepo.findOne({ where: { id } });
        if (!det)
            throw new common_1.NotFoundException('Detalle no encontrado');
        await this.detalleRepo.delete(id);
        return true;
    }
    async emitirOrden(id) {
        const orden = await this.ordenRepo.findOne({ where: { id }, relations: ['detalles'] });
        if (!orden)
            throw new common_1.NotFoundException('Orden no encontrada');
        if (!orden.detalles || orden.detalles.length === 0)
            throw new common_1.BadRequestException('La orden no tiene detalles');
        orden.estado = orden_compra_entity_1.EstadoOrdenCompra.EMITIDA;
        orden.fechaEmision = new Date();
        return this.ordenRepo.save(orden);
    }
    async recepcionarOrden(input) {
        const orden = await this.ordenRepo.findOne({ where: { id: input.ordenId }, relations: ['detalles'] });
        if (!orden)
            throw new common_1.NotFoundException('Orden no encontrada');
        if (orden.estado !== orden_compra_entity_1.EstadoOrdenCompra.EMITIDA && orden.estado !== orden_compra_entity_1.EstadoOrdenCompra.BORRADOR) {
            throw new common_1.BadRequestException('La orden debe estar EMITIDA o BORRADOR para recepcionar');
        }
        const byId = new Map(input.detalles.map(d => [d.detalleId, d]));
        for (const det of orden.detalles || []) {
            const data = byId.get(det.id);
            if (!data)
                continue;
            const cantidadRec = Number(data.cantidadRecibida || 0);
            if (cantidadRec <= 0)
                continue;
            det.cantidadRecibida = (det.cantidadRecibida || 0) + cantidadRec;
            if (data.costoUnitario != null)
                det.costoUnitarioRecepcion = Number(data.costoUnitario);
            await this.detalleRepo.save(det);
            const art = await this.articuloRepo.findOne({ where: { id: det.articuloId } });
            if (!art)
                continue;
            const costoUnit = data.costoUnitario != null ? Number(data.costoUnitario) : (det.precioUnitario ?? art.PrecioCompra ?? 0);
            if (input.puntoMudrasId && input.puntoMudrasId > 0) {
                let stockPunto = await this.stockPuntoRepo.findOne({ where: { articuloId: art.id, puntoMudrasId: input.puntoMudrasId } });
                if (!stockPunto) {
                    stockPunto = this.stockPuntoRepo.create({ articuloId: art.id, puntoMudrasId: input.puntoMudrasId, cantidad: 0 });
                }
                stockPunto.cantidad = Number(stockPunto.cantidad || 0) + cantidadRec;
                await this.stockPuntoRepo.save(stockPunto);
            }
            else {
                const stockActual = Number(art.Stock || 0);
                const nuevoStock = stockActual + cantidadRec;
                const costoPromActual = Number(art.CostoPromedio || 0);
                const costoPromedio = nuevoStock > 0 ? ((costoPromActual * stockActual) + (costoUnit * cantidadRec)) / nuevoStock : costoUnit;
                await this.articuloRepo.update(art.id, { Stock: nuevoStock, CostoPromedio: costoPromedio, PrecioCompra: costoUnit });
            }
        }
        orden.estado = orden_compra_entity_1.EstadoOrdenCompra.RECEPCIONADA;
        orden.fechaRecepcion = new Date();
        return this.ordenRepo.save(orden);
    }
    async getOrden(id) {
        return this.ordenRepo.findOne({ where: { id }, relations: ['detalles', 'proveedor'] });
    }
    async listar(estado, proveedorId) {
        const where = {};
        if (estado)
            where.estado = estado;
        if (proveedorId)
            where.proveedorId = proveedorId;
        return this.ordenRepo.find({ where, relations: ['proveedor'], order: { id: 'DESC' } });
    }
};
exports.ComprasService = ComprasService;
exports.ComprasService = ComprasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(orden_compra_entity_1.OrdenCompra)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_orden_compra_entity_1.DetalleOrdenCompra)),
    __param(2, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_punto_mudras_entity_1.StockPuntoMudras)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ComprasService);
//# sourceMappingURL=compras.service.js.map