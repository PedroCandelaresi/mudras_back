import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindManyOptions } from 'typeorm';
import { Articulo, EstadoArticulo } from './entities/articulo.entity';
import { CrearArticuloDto } from './dto/crear-articulo.dto';
import { ActualizarArticuloDto } from './dto/actualizar-articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articulosRepository: Repository<Articulo>,
  ) {}
  private readonly logger = new Logger(ArticulosService.name);

  async findAll(): Promise<Articulo[]> {
    return this.articulosRepository.find({
      relations: ['proveedor'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Articulo> {
    return this.articulosRepository.findOne({
      where: { id },
      relations: ['proveedor'],
    });
  }

  async findByCodigo(codigo: string): Promise<Articulo> {
    return this.articulosRepository.findOne({
      where: { Codigo: codigo },
      relations: ['proveedor'],
    });
  }

  async findByRubro(rubro: string): Promise<Articulo[]> {
    return this.articulosRepository.find({
      where: { Rubro: rubro },
      relations: ['proveedor'],
      order: { Descripcion: 'ASC' },
    });
  }

  async findByDescripcion(descripcion: string): Promise<Articulo[]> {
    return this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where('articulo.Descripcion LIKE :descripcion', { descripcion: `%${descripcion}%` })
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
  }

  async findByProveedor(idProveedor: number): Promise<Articulo[]> {
    return this.articulosRepository.find({
      where: { idProveedor },
      relations: ['proveedor'],
      order: { Descripcion: 'ASC' },
    });
  }

  async findConStock(): Promise<Articulo[]> {
    return this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where('articulo.Stock > 0')
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
  }

  async findSinStock(): Promise<Articulo[]> {
    return this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where('articulo.Stock <= 0 OR articulo.Stock IS NULL')
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
  }

  async findStockBajo(): Promise<Articulo[]> {
    return this.articulosRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.proveedor', 'proveedor')
      .where('articulo.Stock <= articulo.StockMinimo AND articulo.StockMinimo > 0')
      .orderBy('articulo.Descripcion', 'ASC')
      .getMany();
  }

  async findEnPromocion(): Promise<Articulo[]> {
    return this.articulosRepository.find({
      where: { EnPromocion: true },
      relations: ['proveedor'],
      order: { Descripcion: 'ASC' },
    });
  }

  // Nuevos métodos mejorados
  async crear(crearArticuloDto: CrearArticuloDto): Promise<Articulo> {
    // Verificar que el código no exista
    const articuloExistente = await this.articulosRepository.findOne({
      where: { Codigo: crearArticuloDto.Codigo }
    });

    if (articuloExistente) {
      throw new BadRequestException(`Ya existe un artículo con el código ${crearArticuloDto.Codigo}`);
    }

    const articulo = this.articulosRepository.create({
      ...crearArticuloDto,
    });

    return this.articulosRepository.save(articulo);
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

    const datosActualizados = {
      ...actualizarArticuloDto,
    };

    await this.articulosRepository.update(actualizarArticuloDto.id, datosActualizados);
    return this.articulosRepository.findOne({
      where: { id: actualizarArticuloDto.id },
      relations: ['proveedor']
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
      queryBuilder.andWhere('articulo.rubroId = :rubroId', { rubroId: filtros.rubroId });
    }

    if (filtros.proveedorId) {
      queryBuilder.andWhere('articulo.idProveedor = :proveedorId', { proveedorId: filtros.proveedorId });
    }


    if (filtros.soloConStock) {
      queryBuilder.andWhere('articulo.Deposito > 0');
    }

    if (filtros.soloStockBajo) {
      queryBuilder.andWhere('articulo.Deposito <= articulo.StockMinimo AND articulo.StockMinimo > 0');
    }

    if (filtros.soloSinStock) {
      queryBuilder.andWhere('(articulo.Deposito <= 0 OR articulo.Deposito IS NULL)');
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
  }> {
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
      this.articulosRepository.count({ where: { Deposito: Between(0.01, 999999) } }),
      this.articulosRepository.count({ where: { Deposito: 0 } }),
      this.articulosRepository
        .createQueryBuilder('articulo')
        .where('articulo.Deposito <= articulo.StockMinimo AND articulo.StockMinimo > 0')
        .getCount(),
      this.articulosRepository.count({ where: { EnPromocion: true } }),
      this.articulosRepository.count({ where: { EnPromocion: true } }),
      this.articulosRepository
        .createQueryBuilder('articulo')
        .select('SUM(articulo.Deposito * articulo.PrecioVenta)', 'total')
        .getRawOne()
        .then(result => parseFloat(result.total) || 0)
    ]);

    return {
      totalArticulos,
      articulosActivos,
      articulosConStock,
      articulosSinStock,
      articulosStockBajo,
      articulosEnPromocion,
      articulosPublicadosEnTienda,
      valorTotalStock
    };
  }

  async buscarPorCodigoBarras(codigoBarras: string): Promise<Articulo> {
    return this.articulosRepository.findOne({
      where: { Codigo: codigoBarras },
      relations: ['proveedor']
    });
  }

  async actualizarStock(id: number, nuevoStock: number): Promise<Articulo> {
    const articulo = await this.articulosRepository.findOne({ where: { id } });
    
    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${id} no encontrado`);
    }

    await this.articulosRepository.update(id, { Deposito: nuevoStock });
    return this.articulosRepository.findOne({ where: { id }, relations: ['proveedor'] });
  }
}
