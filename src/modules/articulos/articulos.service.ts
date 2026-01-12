import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';
import { Rubro } from '../rubros/entities/rubro.entity';
import { StockPuntoMudras } from '../puntos-mudras/entities/stock-punto-mudras.entity';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articulosRepository: Repository<Articulo>,
    @InjectRepository(Rubro)
    private rubrosRepository: Repository<Rubro>,
    @InjectRepository(StockPuntoMudras)
    private stockPuntosRepository: Repository<StockPuntoMudras>,
  ) { }
  private readonly logger = new Logger(ArticulosService.name);
  private readonly stockSumSubquery = '(SELECT COALESCE(SUM(spm.cantidad), 0) FROM stock_puntos_mudras spm WHERE spm.articulo_id = articulo.id)';

  private parseNullableDate(value?: string | Date | null): Date | null {
    if (!value) {
      return null;
    }

    return value instanceof Date ? value : new Date(value);
  }

  private async hydrateTotalStock(items?: Articulo | Articulo[] | null): Promise<void> {
    if (!items) return;
    const articulos = Array.isArray(items) ? items : [items];
    if (!articulos.length) return;
    const ids = articulos.map(a => a.id).filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
    if (!ids.length) return;

    const totales = await this.stockPuntosRepository
      .createQueryBuilder('spm')
      .select('spm.articuloId', 'articuloId')
      .addSelect('COALESCE(SUM(spm.cantidad), 0)', 'total')
      .where('spm.articuloId IN (:...ids)', { ids })
      .groupBy('spm.articuloId')
      .getRawMany();

    const map = new Map<number, number>();
    for (const row of totales) {
      map.set(Number(row.articuloId), Number(row.total));
    }

    articulos.forEach(art => {
      const puntosYDepositos = map.get(art.id) ?? 0;
      art.totalStock = Number(puntosYDepositos.toFixed(2));
    });
  }

  async findAll(): Promise<Articulo[]> {
    const articulos = await this.articulosRepository.find({
      relations: ['proveedor', 'rubro'],
      order: { id: 'ASC' },
    });
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findOne(id: number): Promise<Articulo> {
    const articulo = await this.articulosRepository.findOne({
      where: { id },
      relations: ['proveedor', 'rubro'],
    });
    await this.hydrateTotalStock(articulo);
    return articulo;
  }

  async findByCodigo(codigo: string): Promise<Articulo> {
    const articulo = await this.articulosRepository.findOne({
      where: { Codigo: codigo },
      relations: ['proveedor', 'rubro'],
    });
    await this.hydrateTotalStock(articulo);
    return articulo;
  }

  async findByRubro(rubro: string): Promise<Articulo[]> {
    const articulos = await this.articulosRepository.find({
      where: { Rubro: rubro },
      relations: ['proveedor', 'rubro'],
      order: { Descripcion: 'ASC' },
    });
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findByDescripcion(descripcion: string): Promise<Articulo[]> {
    const articulos = await this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where('articulo.Descripcion LIKE :descripcion', { descripcion: `%${descripcion}%` })
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findByProveedor(idProveedor: number): Promise<Articulo[]> {
    const articulos = await this.articulosRepository.find({
      where: { idProveedor },
      relations: ['proveedor', 'rubro'],
      order: { Descripcion: 'ASC' },
    });
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findConStock(): Promise<Articulo[]> {
    const articulos = await this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where(`${this.stockSumSubquery} > 0`)
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findSinStock(): Promise<Articulo[]> {
    const articulos = await this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where(`${this.stockSumSubquery} = 0`)
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findStockBajo(): Promise<Articulo[]> {
    const articulos = await this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where(`${this.stockSumSubquery} > 0 AND ${this.stockSumSubquery} <= articulo.StockMinimo AND articulo.StockMinimo > 0`)
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async findEnPromocion(): Promise<Articulo[]> {
    const articulos = await this.articulosRepository.find({
      where: { EnPromocion: true },
      relations: ['proveedor', 'rubro'],
      order: { Descripcion: 'ASC' },
    });
    await this.hydrateTotalStock(articulos);
    return articulos;
  }

  async crear(crearArticuloDto: CrearArticuloDto): Promise<Articulo> {
    const articuloExistente = await this.articulosRepository.findOne({
      where: { Codigo: crearArticuloDto.Codigo }
    });

    if (articuloExistente) {
      throw new BadRequestException(`Ya existe un artículo con el código ${crearArticuloDto.Codigo}`);
    }

    const nuevo = this.articulosRepository.create({
      Codigo: crearArticuloDto.Codigo,
      Rubro: crearArticuloDto.Rubro ?? null,
      ImagenUrl: crearArticuloDto.ImagenUrl ?? null,
      Descripcion: crearArticuloDto.Descripcion,
      Marca: crearArticuloDto.Marca ?? null,
      PrecioVenta: crearArticuloDto.precioVenta,
      PrecioCompra: crearArticuloDto.PrecioCompra ?? null,
      StockMinimo: crearArticuloDto.stockMinimo,

      Deposito: crearArticuloDto.deposito ?? null,
      AlicuotaIva: crearArticuloDto.AlicuotaIva ?? null,
      FechaCompra: this.parseNullableDate(crearArticuloDto.FechaCompra),
      idProveedor: crearArticuloDto.idProveedor ?? null,
      Lista2: crearArticuloDto.Lista2 ?? null,
      Lista3: crearArticuloDto.Lista3 ?? null,
      Unidad: crearArticuloDto.Unidad ?? null,
      Lista4: crearArticuloDto.Lista4 ?? null,
      PorcentajeGanancia: crearArticuloDto.PorcentajeGanancia ?? null,
      Calculado: crearArticuloDto.Calculado ?? false,
      CodigoProv: crearArticuloDto.CodigoProv ?? null,
      CostoPromedio: crearArticuloDto.CostoPromedio ?? crearArticuloDto.PrecioCompra ?? null,
      CostoEnDolares: crearArticuloDto.CostoEnDolares ?? false,
      FechaModif: this.parseNullableDate(crearArticuloDto.FechaModif) ?? new Date(),
      PrecioListaProveedor: crearArticuloDto.PrecioListaProveedor ?? null,
      StockInicial: crearArticuloDto.StockInicial ?? crearArticuloDto.stock ?? null,
      Ubicacion: crearArticuloDto.Ubicacion ?? null,
      Lista1EnDolares: crearArticuloDto.Lista1EnDolares ?? false,
      Dto1: crearArticuloDto.Dto1 ?? null,
      Dto2: crearArticuloDto.Dto2 ?? null,
      Dto3: crearArticuloDto.Dto3 ?? null,
      Impuesto: crearArticuloDto.Impuesto ?? null,
      ImpuestoPorcentual: crearArticuloDto.ImpuestoPorcentual ?? (crearArticuloDto.AlicuotaIva != null ? true : null),
      EnPromocion: crearArticuloDto.EnPromocion ?? false,
      UsaTalle: crearArticuloDto.UsaTalle ?? false,
      Compuesto: crearArticuloDto.Compuesto ?? false,
      Combustible: crearArticuloDto.Combustible ?? false,
    } as Partial<Articulo>);

    const saved = await this.articulosRepository.save(nuevo as Articulo);
    return this.articulosRepository.findOne({ where: { id: saved.id }, relations: ['proveedor', 'rubro'] });
  }

  async actualizar(actualizarArticuloDto: ActualizarArticuloDto): Promise<Articulo> {
    const articulo = await this.articulosRepository.findOne({
      where: { id: actualizarArticuloDto.id }
    });

    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${actualizarArticuloDto.id} no encontrado`);
    }

    // Verificar código único si se está actualizando
    if (actualizarArticuloDto.Codigo && actualizarArticuloDto.Codigo !== articulo.Codigo) {
      const articuloExistente = await this.articulosRepository.findOne({
        where: { Codigo: actualizarArticuloDto.Codigo }
      });

      if (articuloExistente) {
        throw new BadRequestException(`Ya existe un artículo con el código ${actualizarArticuloDto.Codigo}`);
      }
    }

    // Mapear solo campos presentes del DTO a columnas reales
    const patch: any = {};
    if (actualizarArticuloDto.Codigo != null) patch.Codigo = actualizarArticuloDto.Codigo;
    if (actualizarArticuloDto.Rubro != null) patch.Rubro = actualizarArticuloDto.Rubro;
    if (actualizarArticuloDto.ImagenUrl != null) patch.ImagenUrl = actualizarArticuloDto.ImagenUrl;
    if (actualizarArticuloDto.Descripcion != null) patch.Descripcion = actualizarArticuloDto.Descripcion;
    if (actualizarArticuloDto.Marca != null) patch.Marca = actualizarArticuloDto.Marca;
    if (actualizarArticuloDto.precioVenta != null) patch.PrecioVenta = actualizarArticuloDto.precioVenta;
    if (actualizarArticuloDto.PrecioCompra != null) patch.PrecioCompra = actualizarArticuloDto.PrecioCompra;

    if (actualizarArticuloDto.stockMinimo != null) patch.StockMinimo = actualizarArticuloDto.stockMinimo;
    if (actualizarArticuloDto.deposito != null) patch.Deposito = actualizarArticuloDto.deposito;
    if (actualizarArticuloDto.AlicuotaIva != null) patch.AlicuotaIva = actualizarArticuloDto.AlicuotaIva;
    if (actualizarArticuloDto.FechaCompra != null) patch.FechaCompra = this.parseNullableDate(actualizarArticuloDto.FechaCompra);
    if (actualizarArticuloDto.Impuesto != null) patch.Impuesto = actualizarArticuloDto.Impuesto;
    if (actualizarArticuloDto.ImpuestoPorcentual != null) patch.ImpuestoPorcentual = actualizarArticuloDto.ImpuestoPorcentual as any;
    if (actualizarArticuloDto.Unidad != null) patch.Unidad = actualizarArticuloDto.Unidad;
    if (actualizarArticuloDto.idProveedor != null) patch.idProveedor = actualizarArticuloDto.idProveedor;
    if (actualizarArticuloDto.Lista2 != null) patch.Lista2 = actualizarArticuloDto.Lista2;
    if (actualizarArticuloDto.Lista3 != null) patch.Lista3 = actualizarArticuloDto.Lista3;
    if (actualizarArticuloDto.Lista4 != null) patch.Lista4 = actualizarArticuloDto.Lista4;
    if (actualizarArticuloDto.PorcentajeGanancia != null) patch.PorcentajeGanancia = actualizarArticuloDto.PorcentajeGanancia;
    if (actualizarArticuloDto.Calculado != null) patch.Calculado = actualizarArticuloDto.Calculado;
    if (actualizarArticuloDto.CodigoProv != null) patch.CodigoProv = actualizarArticuloDto.CodigoProv;
    if (actualizarArticuloDto.CostoPromedio != null) patch.CostoPromedio = actualizarArticuloDto.CostoPromedio;
    if (actualizarArticuloDto.CostoEnDolares != null) patch.CostoEnDolares = actualizarArticuloDto.CostoEnDolares;
    if (actualizarArticuloDto.FechaModif != null) patch.FechaModif = this.parseNullableDate(actualizarArticuloDto.FechaModif) ?? new Date();
    if (actualizarArticuloDto.PrecioListaProveedor != null) patch.PrecioListaProveedor = actualizarArticuloDto.PrecioListaProveedor;
    if (actualizarArticuloDto.StockInicial != null) patch.StockInicial = actualizarArticuloDto.StockInicial;
    if (actualizarArticuloDto.Ubicacion != null) patch.Ubicacion = actualizarArticuloDto.Ubicacion;
    if (actualizarArticuloDto.Lista1EnDolares != null) patch.Lista1EnDolares = actualizarArticuloDto.Lista1EnDolares;
    if (actualizarArticuloDto.Dto1 != null) patch.Dto1 = actualizarArticuloDto.Dto1;
    if (actualizarArticuloDto.Dto2 != null) patch.Dto2 = actualizarArticuloDto.Dto2;
    if (actualizarArticuloDto.Dto3 != null) patch.Dto3 = actualizarArticuloDto.Dto3;
    if (actualizarArticuloDto.EnPromocion != null) patch.EnPromocion = actualizarArticuloDto.EnPromocion;
    if (actualizarArticuloDto.UsaTalle != null) patch.UsaTalle = actualizarArticuloDto.UsaTalle;
    if (actualizarArticuloDto.Compuesto != null) patch.Compuesto = actualizarArticuloDto.Compuesto;
    if (actualizarArticuloDto.Combustible != null) patch.Combustible = actualizarArticuloDto.Combustible;

    await this.articulosRepository.update(actualizarArticuloDto.id, patch);
    return this.articulosRepository.findOne({
      where: { id: actualizarArticuloDto.id },
      relations: ['proveedor', 'rubro']
    });
  }

  async eliminar(id: number): Promise<boolean> {
    const articulo = await this.articulosRepository.findOne({ where: { id } });

    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    }

    // Eliminar físicamente ya que no tenemos campo estado
    await this.articulosRepository.delete(id);
    return true;
  }

  async buscarConFiltros(filtros: FiltrosArticuloDto): Promise<{ articulos: Articulo[], total: number }> {
    this.logger.debug(`buscarConFiltros -> pagina=${filtros.pagina} limite=${filtros.limite} ordenarPor=${filtros.ordenarPor} dir=${filtros.direccionOrden} busqueda=${filtros.busqueda ?? ''}`);
    const queryBuilder = this.articulosRepository.createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor');

    // Aplicar filtros
    if (filtros.busqueda) {
      queryBuilder.andWhere(
        '(articulo.Descripcion LIKE :busqueda OR articulo.Codigo LIKE :busqueda OR articulo.Marca LIKE :busqueda)',
        { busqueda: `%${filtros.busqueda}%` }
      );
    }

    if (filtros.codigo) {
      queryBuilder.andWhere('articulo.Codigo LIKE :codigo', { codigo: `%${filtros.codigo}%` });
    }

    if (filtros.descripcion) {
      queryBuilder.andWhere('articulo.Descripcion LIKE :descripcion', { descripcion: `%${filtros.descripcion}%` });
    }

    if (filtros.marca) {
      queryBuilder.andWhere('articulo.Marca LIKE :marca', { marca: `%${filtros.marca}%` });
    }

    if (filtros.rubroId) {
      const rubro = await this.rubrosRepository.findOne({ where: { Id: filtros.rubroId } });
      if (!rubro) {
        throw new NotFoundException(`Rubro con ID ${filtros.rubroId} no encontrado`);
      }
      queryBuilder.andWhere('articulo.Rubro = :rubroFiltrado', { rubroFiltrado: rubro.Rubro });
    }

    if (filtros.proveedorId) {
      queryBuilder.andWhere('articulo.idProveedor = :proveedorId', { proveedorId: filtros.proveedorId });
    }


    // Estado de stock: considerar el stock total real (sum(stock_puntos_mudras) en puntos de venta y depósitos)
    const totalStockSubquery = this.stockSumSubquery;

    if (filtros.soloConStock) {
      // Disponible: totalStock > StockMinimo
      queryBuilder.andWhere(`${totalStockSubquery} > articulo.StockMinimo`);
    }

    if (filtros.soloStockBajo) {
      // Stock Bajo: 0 < totalStock <= StockMinimo
      queryBuilder.andWhere(`${totalStockSubquery} > 0 AND ${totalStockSubquery} <= articulo.StockMinimo AND articulo.StockMinimo > 0`);
    }

    if (filtros.soloSinStock) {
      // Sin stock: totalStock == 0
      queryBuilder.andWhere(`${totalStockSubquery} = 0`);
    }

    if (filtros.soloEnPromocion) {
      queryBuilder.andWhere('articulo.EnPromocion = true');
    }


    if (filtros.precioMinimo) {
      queryBuilder.andWhere('articulo.PrecioVenta >= :precioMinimo', { precioMinimo: filtros.precioMinimo });
    }

    if (filtros.precioMaximo) {
      queryBuilder.andWhere('articulo.PrecioVenta <= :precioMaximo', { precioMaximo: filtros.precioMaximo });
    }

    // Contar total
    const total = await queryBuilder.getCount();

    // Aplicar paginación y ordenamiento
    const articulos = await queryBuilder
      .orderBy(`articulo.${filtros.ordenarPor}`, filtros.direccionOrden as 'ASC' | 'DESC')
      .skip(filtros.pagina * filtros.limite)
      .take(filtros.limite)
      .getMany();
    await this.hydrateTotalStock(articulos);
    this.logger.debug(`buscarConFiltros <- devueltos=${articulos.length} de total=${total}`);
    return { articulos, total };
  }

  async obtenerEstadisticas(): Promise<{
    totalArticulos: number;
    articulosActivos: number;
    articulosConStock: number;
    articulosSinStock: number;
    articulosStockBajo: number;
    articulosEnPromocion: number;
    articulosPublicadosEnTienda: number;
    valorTotalStock: number;
    totalUnidades: number;
  }> {
    const stockSum = this.stockSumSubquery;
    const [
      totalArticulos,
      articulosActivos,
      articulosConStock,
      articulosSinStock,
      articulosStockBajo,
      articulosEnPromocion,
      articulosPublicadosEnTienda,
      valorTotalStock
    ] = await Promise.all([
      this.articulosRepository.count(),
      this.articulosRepository.count(),
      this.articulosRepository
        .createQueryBuilder('articulo')
        .where(`${stockSum} > 0`)
        .getCount(),
      this.articulosRepository
        .createQueryBuilder('articulo')
        .where(`${stockSum} = 0`)
        .getCount(),
      this.articulosRepository
        .createQueryBuilder('articulo')
        .where(`${stockSum} > 0 AND ${stockSum} <= articulo.StockMinimo AND articulo.StockMinimo > 0`)
        .getCount(),
      this.articulosRepository.count({ where: { EnPromocion: true } }),
      this.articulosRepository.count({ where: { EnPromocion: true } }),
      this.articulosRepository
        .createQueryBuilder('articulo')
        .select(`COALESCE(SUM(${stockSum} * articulo.PrecioVenta), 0)`, 'total')
        .getRawOne()
        .then(result => parseFloat(result.total) || 0)
    ]);

    // Calcular total de unidades global: suma de cantidades en puntos de venta y depósitos (stock_puntos_mudras)
    const totalUnidades = await this.stockPuntosRepository
      .createQueryBuilder('spm')
      .select('COALESCE(SUM(spm.cantidad), 0)', 'total')
      .getRawOne()
      .then(r => Number(parseFloat(r.total).toFixed(2)) || 0);

    return {
      totalArticulos,
      articulosActivos,
      articulosConStock,
      articulosSinStock,
      articulosStockBajo,
      articulosEnPromocion,
      articulosPublicadosEnTienda,
      valorTotalStock
      ,
      totalUnidades
    };
  }

  async buscarPorCodigoBarras(codigoBarras: string): Promise<Articulo> {
    return this.articulosRepository.findOne({
      where: { Codigo: codigoBarras },
      relations: ['proveedor', 'rubro']
    });
  }


}
