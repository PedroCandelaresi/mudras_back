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
var AfipService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comprobante_afip_entity_1 = require("../entities/comprobante-afip.entity");
let AfipService = AfipService_1 = class AfipService {
    constructor(comprobanteAfipRepository) {
        this.comprobanteAfipRepository = comprobanteAfipRepository;
        this.logger = new common_1.Logger(AfipService_1.name);
    }
    async emitirComprobante(venta, datos) {
        const comprobante = this.comprobanteAfipRepository.create({
            ventaId: venta.id,
            tipoComprobante: datos.tipoComprobante,
            estado: comprobante_afip_entity_1.EstadoComprobanteAfip.PENDIENTE,
            puntoVenta: datos.puntoVenta,
            cuitCliente: datos.cuitCliente,
            importeTotal: datos.importeTotal,
            importeGravado: datos.importeGravado,
            importeExento: datos.importeExento,
            importeIva: datos.importeIva,
        });
        const comprobanteGuardado = await this.comprobanteAfipRepository.save(comprobante);
        try {
            const respuesta = await this.llamarAfipStub(datos);
            if (respuesta.exito) {
                comprobanteGuardado.estado = comprobante_afip_entity_1.EstadoComprobanteAfip.EMITIDO;
                comprobanteGuardado.numeroComprobante = respuesta.numeroComprobante;
                comprobanteGuardado.cae = respuesta.cae;
                comprobanteGuardado.vencimientoCae = respuesta.vencimientoCae;
                comprobanteGuardado.urlPdf = respuesta.urlPdf;
                comprobanteGuardado.datosAfip = JSON.stringify(respuesta.datosCompletos);
                this.logger.log(`Comprobante AFIP emitido exitosamente: ${respuesta.numeroComprobante}`);
            }
            else {
                comprobanteGuardado.estado = comprobante_afip_entity_1.EstadoComprobanteAfip.ERROR;
                comprobanteGuardado.mensajeError = respuesta.error;
                this.logger.error(`Error al emitir comprobante AFIP: ${respuesta.error}`);
            }
            return await this.comprobanteAfipRepository.save(comprobanteGuardado);
        }
        catch (error) {
            comprobanteGuardado.estado = comprobante_afip_entity_1.EstadoComprobanteAfip.ERROR;
            comprobanteGuardado.mensajeError = `Error de comunicación: ${error.message}`;
            this.logger.error(`Error de comunicación con AFIP: ${error.message}`);
            return await this.comprobanteAfipRepository.save(comprobanteGuardado);
        }
    }
    async reintentarEmision(comprobanteId) {
        const comprobante = await this.comprobanteAfipRepository.findOne({
            where: { id: comprobanteId },
            relations: ['venta', 'venta.detalles', 'venta.detalles.articulo']
        });
        if (!comprobante) {
            throw new Error('Comprobante no encontrado');
        }
        if (comprobante.estado === comprobante_afip_entity_1.EstadoComprobanteAfip.EMITIDO) {
            throw new Error('El comprobante ya fue emitido exitosamente');
        }
        const datos = {
            tipoComprobante: comprobante.tipoComprobante,
            puntoVenta: comprobante.puntoVenta,
            cuitCliente: comprobante.cuitCliente,
            importeTotal: comprobante.importeTotal,
            importeGravado: comprobante.importeGravado,
            importeExento: comprobante.importeExento,
            importeIva: comprobante.importeIva,
            conceptos: comprobante.venta.detalles?.map(detalle => ({
                descripcion: detalle.articulo.nombre,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                importeTotal: detalle.subtotal,
            })) || [],
        };
        try {
            const respuesta = await this.llamarAfipStub(datos);
            if (respuesta.exito) {
                comprobante.estado = comprobante_afip_entity_1.EstadoComprobanteAfip.EMITIDO;
                comprobante.numeroComprobante = respuesta.numeroComprobante;
                comprobante.cae = respuesta.cae;
                comprobante.vencimientoCae = respuesta.vencimientoCae;
                comprobante.urlPdf = respuesta.urlPdf;
                comprobante.datosAfip = JSON.stringify(respuesta.datosCompletos);
                comprobante.mensajeError = null;
                this.logger.log(`Comprobante AFIP reintentado exitosamente: ${respuesta.numeroComprobante}`);
            }
            else {
                comprobante.mensajeError = respuesta.error;
                this.logger.error(`Error al reintentar comprobante AFIP: ${respuesta.error}`);
            }
            return await this.comprobanteAfipRepository.save(comprobante);
        }
        catch (error) {
            comprobante.mensajeError = `Error de comunicación: ${error.message}`;
            this.logger.error(`Error de comunicación al reintentar AFIP: ${error.message}`);
            return await this.comprobanteAfipRepository.save(comprobante);
        }
    }
    async llamarAfipStub(datos) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        const exito = Math.random() > 0.1;
        if (exito) {
            const numeroComprobante = Math.floor(Math.random() * 999999) + 1;
            const cae = this.generarCaeStub();
            const vencimientoCae = new Date();
            vencimientoCae.setDate(vencimientoCae.getDate() + 60);
            return {
                exito: true,
                numeroComprobante,
                cae,
                vencimientoCae,
                urlPdf: `https://afip-stub.com/pdf/${numeroComprobante}.pdf`,
                datosCompletos: {
                    numeroComprobante,
                    cae,
                    vencimientoCae,
                    fechaEmision: new Date(),
                    tipoComprobante: datos.tipoComprobante,
                    puntoVenta: datos.puntoVenta,
                    importeTotal: datos.importeTotal,
                }
            };
        }
        else {
            const errores = [
                'CUIT inválido',
                'Punto de venta no autorizado',
                'Importe inválido',
                'Servicio AFIP temporalmente no disponible',
                'Error de validación en conceptos',
            ];
            return {
                exito: false,
                error: errores[Math.floor(Math.random() * errores.length)]
            };
        }
    }
    generarCaeStub() {
        return Math.floor(Math.random() * 99999999999999).toString().padStart(14, '0');
    }
    async obtenerComprobantesVenta(ventaId) {
        return await this.comprobanteAfipRepository.find({
            where: { ventaId },
            order: { creadoEn: 'DESC' }
        });
    }
    async obtenerComprobantesPendientes() {
        return await this.comprobanteAfipRepository.find({
            where: { estado: comprobante_afip_entity_1.EstadoComprobanteAfip.PENDIENTE },
            relations: ['venta'],
            order: { creadoEn: 'ASC' }
        });
    }
};
exports.AfipService = AfipService;
exports.AfipService = AfipService = AfipService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comprobante_afip_entity_1.ComprobanteAfip)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AfipService);
//# sourceMappingURL=afip.service.js.map