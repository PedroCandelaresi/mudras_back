import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComprobanteAfip, TipoComprobanteAfip, EstadoComprobanteAfip } from '../entities/comprobante-afip.entity';
import { VentaCaja } from '../entities/venta-caja.entity';

export interface DatosFacturaAfip {
  tipoComprobante: TipoComprobanteAfip;
  puntoVenta: number;
  cuitCliente: string;
  importeTotal: number;
  importeGravado: number;
  importeExento: number;
  importeIva: number;
  conceptos: Array<{
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    importeTotal: number;
  }>;
}

export interface RespuestaAfip {
  exito: boolean;
  numeroComprobante?: number;
  cae?: string;
  vencimientoCae?: Date;
  urlPdf?: string;
  error?: string;
  datosCompletos?: any;
}

@Injectable()
export class AfipService {
  private readonly logger = new Logger(AfipService.name);

  constructor(
    @InjectRepository(ComprobanteAfip)
    private comprobanteAfipRepository: Repository<ComprobanteAfip>,
  ) {}

  async emitirComprobante(venta: VentaCaja, datos: DatosFacturaAfip): Promise<ComprobanteAfip> {
    // Crear registro de comprobante
    const comprobante = this.comprobanteAfipRepository.create({
      ventaId: venta.id,
      tipoComprobante: datos.tipoComprobante,
      estado: EstadoComprobanteAfip.PENDIENTE,
      puntoVenta: datos.puntoVenta,
      cuitCliente: datos.cuitCliente,
      importeTotal: datos.importeTotal,
      importeGravado: datos.importeGravado,
      importeExento: datos.importeExento,
      importeIva: datos.importeIva,
    });

    const comprobanteGuardado = await this.comprobanteAfipRepository.save(comprobante);

    try {
      // STUB: Simular llamada a AFIP
      const respuesta = await this.llamarAfipStub(datos);

      if (respuesta.exito) {
        // Actualizar comprobante con datos de AFIP
        comprobanteGuardado.estado = EstadoComprobanteAfip.EMITIDO;
        comprobanteGuardado.numeroComprobante = respuesta.numeroComprobante;
        comprobanteGuardado.cae = respuesta.cae;
        comprobanteGuardado.vencimientoCae = respuesta.vencimientoCae;
        comprobanteGuardado.urlPdf = respuesta.urlPdf;
        comprobanteGuardado.datosAfip = JSON.stringify(respuesta.datosCompletos);

        this.logger.log(`Comprobante AFIP emitido exitosamente: ${respuesta.numeroComprobante}`);
      } else {
        // Error en AFIP
        comprobanteGuardado.estado = EstadoComprobanteAfip.ERROR;
        comprobanteGuardado.mensajeError = respuesta.error;

        this.logger.error(`Error al emitir comprobante AFIP: ${respuesta.error}`);
      }

      return await this.comprobanteAfipRepository.save(comprobanteGuardado);

    } catch (error) {
      // Error de comunicación
      comprobanteGuardado.estado = EstadoComprobanteAfip.ERROR;
      comprobanteGuardado.mensajeError = `Error de comunicación: ${error.message}`;

      this.logger.error(`Error de comunicación con AFIP: ${error.message}`);
      
      return await this.comprobanteAfipRepository.save(comprobanteGuardado);
    }
  }

  async reintentarEmision(comprobanteId: number): Promise<ComprobanteAfip> {
    const comprobante = await this.comprobanteAfipRepository.findOne({
      where: { id: comprobanteId },
      relations: ['venta', 'venta.detalles', 'venta.detalles.articulo']
    });

    if (!comprobante) {
      throw new Error('Comprobante no encontrado');
    }

    if (comprobante.estado === EstadoComprobanteAfip.EMITIDO) {
      throw new Error('El comprobante ya fue emitido exitosamente');
    }

    // Reconstruir datos para AFIP
    const datos: DatosFacturaAfip = {
      tipoComprobante: comprobante.tipoComprobante,
      puntoVenta: comprobante.puntoVenta,
      cuitCliente: comprobante.cuitCliente,
      importeTotal: comprobante.importeTotal,
      importeGravado: comprobante.importeGravado,
      importeExento: comprobante.importeExento,
      importeIva: comprobante.importeIva,
      conceptos: comprobante.venta.detalles?.map(detalle => ({
        descripcion: detalle.articulo.Descripcion,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        importeTotal: detalle.subtotal,
      })) || [],
    };

    try {
      const respuesta = await this.llamarAfipStub(datos);

      if (respuesta.exito) {
        comprobante.estado = EstadoComprobanteAfip.EMITIDO;
        comprobante.numeroComprobante = respuesta.numeroComprobante;
        comprobante.cae = respuesta.cae;
        comprobante.vencimientoCae = respuesta.vencimientoCae;
        comprobante.urlPdf = respuesta.urlPdf;
        comprobante.datosAfip = JSON.stringify(respuesta.datosCompletos);
        comprobante.mensajeError = null;

        this.logger.log(`Comprobante AFIP reintentado exitosamente: ${respuesta.numeroComprobante}`);
      } else {
        comprobante.mensajeError = respuesta.error;
        this.logger.error(`Error al reintentar comprobante AFIP: ${respuesta.error}`);
      }

      return await this.comprobanteAfipRepository.save(comprobante);

    } catch (error) {
      comprobante.mensajeError = `Error de comunicación: ${error.message}`;
      this.logger.error(`Error de comunicación al reintentar AFIP: ${error.message}`);
      
      return await this.comprobanteAfipRepository.save(comprobante);
    }
  }

  private async llamarAfipStub(datos: DatosFacturaAfip): Promise<RespuestaAfip> {
    // STUB: Simular demora de red
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // STUB: Simular éxito/error aleatorio (90% éxito)
    const exito = Math.random() > 0.1;

    if (exito) {
      // Simular respuesta exitosa de AFIP
      const numeroComprobante = Math.floor(Math.random() * 999999) + 1;
      const cae = this.generarCaeStub();
      const vencimientoCae = new Date();
      vencimientoCae.setDate(vencimientoCae.getDate() + 60); // CAE vence en 60 días

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
          // Más datos que devolvería AFIP...
        }
      };
    } else {
      // Simular error de AFIP
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

  private generarCaeStub(): string {
    // Generar CAE de 14 dígitos (formato real de AFIP)
    return Math.floor(Math.random() * 99999999999999).toString().padStart(14, '0');
  }

  async obtenerComprobantesVenta(ventaId: number): Promise<ComprobanteAfip[]> {
    return await this.comprobanteAfipRepository.find({
      where: { ventaId },
      order: { creadoEn: 'DESC' }
    });
  }

  async obtenerComprobantesPendientes(): Promise<ComprobanteAfip[]> {
    return await this.comprobanteAfipRepository.find({
      where: { estado: EstadoComprobanteAfip.PENDIENTE },
      relations: ['venta'],
      order: { creadoEn: 'ASC' }
    });
  }
}
