import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorInput } from './dto/create-proveedor.dto';
import { UpdateProveedorInput } from './dto/update-proveedor.dto';
import { RubroPorProveedor } from './dto/rubros-por-proveedor.dto';
import { Rubro } from '../rubros/entities/rubro.entity';
import { In } from 'typeorm';
import { Articulo } from '../articulos/entities/articulo.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
    @InjectRepository(Rubro)
    private rubrosRepository: Repository<Rubro>,
  ) { }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find({
      order: { IdProveedor: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({
      where: { IdProveedor: id },
      relations: ['articulos', 'rubros']
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    return proveedor;
  }

  async findByCodigo(codigo: string): Promise<Proveedor> {
    return this.proveedoresRepository.findOne({
      where: { Codigo: codigo },
    });
  }

  async findByNombre(nombre: string): Promise<Proveedor[]> {
    return this.proveedoresRepository
      .createQueryBuilder('proveedor')
      .where('proveedor.Nombre LIKE :nombre', { nombre: `%${nombre}%` })
      .getMany();
  }

  async create(createProveedorInput: CreateProveedorInput): Promise<Proveedor> {
    const { rubrosIds, ...createData } = createProveedorInput;
    // Verificar si ya existe un proveedor con el mismo código
    if (createProveedorInput.Codigo) {
      const existingByCodigo = await this.findByCodigo(createProveedorInput.Codigo);
      if (existingByCodigo) {
        throw new ConflictException(`Ya existe un proveedor con el código ${createProveedorInput.Codigo}`);
      }
    }

    // Verificar si ya existe un proveedor con el mismo nombre
    if (createProveedorInput.Nombre) {
      const existingByNombre = await this.proveedoresRepository.findOne({
        where: { Nombre: createProveedorInput.Nombre }
      });
      if (existingByNombre) {
        throw new ConflictException(`Ya existe un proveedor con el nombre "${createProveedorInput.Nombre}"`);
      }
    }

    const proveedor = this.proveedoresRepository.create({
      ...createData,
      FechaModif: new Date(),
    });

    if (rubrosIds && rubrosIds.length > 0) {
      const rubros = await this.rubrosRepository.findBy({
        Id: In(rubrosIds),
      });
      proveedor.rubros = rubros;
    }

    return this.proveedoresRepository.save(proveedor);
  }

  async update(updateProveedorInput: UpdateProveedorInput): Promise<Proveedor> {
    const { IdProveedor, rubrosIds, ...updateData } = updateProveedorInput;

    const proveedor = await this.proveedoresRepository.findOne({
      where: { IdProveedor },
      relations: ['rubros']
    });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${IdProveedor} no encontrado`);
    }

    // Verificar si ya existe otro proveedor con el mismo código
    if (updateData.Codigo && updateData.Codigo !== proveedor.Codigo) {
      const existingByCodigo = await this.findByCodigo(updateData.Codigo);
      if (existingByCodigo && existingByCodigo.IdProveedor !== IdProveedor) {
        throw new ConflictException(`Ya existe otro proveedor con el código ${updateData.Codigo}`);
      }
    }

    // Verificar si ya existe otro proveedor con el mismo nombre
    if (updateData.Nombre && updateData.Nombre !== proveedor.Nombre) {
      const existingByNombre = await this.proveedoresRepository.findOne({
        where: { Nombre: updateData.Nombre }
      });
      if (existingByNombre && existingByNombre.IdProveedor !== IdProveedor) {
        throw new ConflictException(`Ya existe otro proveedor con el nombre "${updateData.Nombre}"`);
      }
    }

    // Actualizar datos básicos en la instancia
    Object.assign(proveedor, {
      ...updateData,
      FechaModif: new Date(),
    });

    // Actualizar relaciones (rubros)
    if (rubrosIds !== undefined) {
      if (rubrosIds.length > 0) {
        const rubros = await this.rubrosRepository.findBy({
          Id: In(rubrosIds),
        });
        proveedor.rubros = rubros; // Asignar array de entidades Rubro
      } else {
        proveedor.rubros = []; // Limpiar relaciones si el array está vacío
      }
    }

    // Guardar la entidad completa (TypeORM maneja la actualización y el cascade de la relación ManyToMany)
    return this.proveedoresRepository.save(proveedor);
  }

  async findArticulosByProveedor(
    proveedorId: number,
    filtro?: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<{ articulos: any[], total: number }> {
    const proveedor = await this.findOne(proveedorId);

    let query = this.proveedoresRepository
      .createQueryBuilder('proveedor')
      .leftJoinAndSelect('proveedor.articulos', 'articulo')
      .where('proveedor.IdProveedor = :proveedorId', { proveedorId });

    if (filtro) {
      query = query.andWhere(
        '(articulo.Descripcion LIKE :filtro OR articulo.Codigo LIKE :filtro)',
        { filtro: `%${filtro}%` }
      );
    }

    const [result] = await query.getManyAndCount();
    const articulos = result.length > 0 ? result[0].articulos : [];

    // Aplicar paginación manualmente ya que TypeORM no maneja bien la paginación con relaciones
    const total = articulos.length;
    const articulosPaginados = articulos.slice(offset, offset + limit);

    return {
      articulos: articulosPaginados.map(articulo => ({
        Id: articulo.id,
        Codigo: articulo.Codigo,
        Descripcion: articulo.Descripcion,
        Stock: 0,
        PrecioVenta: articulo.PrecioVenta,
        Rubro: articulo.Rubro,
        StockMinimo: articulo.StockMinimo,
        EnPromocion: articulo.EnPromocion,
        stock: 0,
        precio: articulo.PrecioVenta || 0,
        rubro: articulo.Rubro
      })),
      total
    };
  }

  async remove(id: number): Promise<boolean> {
    const proveedor = await this.findOne(id);

    // Desvincular artículos asociados (setear idProveedor a NULL)
    await this.proveedoresRepository.manager.update(Articulo, { idProveedor: id }, { idProveedor: null });

    await this.proveedoresRepository.remove(proveedor);
    return true;
  }

  async findRubrosByProveedor(proveedorId: number): Promise<RubroPorProveedor[]> {
    const query = `
      SELECT
        pr.id,
        pr.proveedor_id AS proveedorId,
        pr.proveedor_nombre AS proveedorNombre,
        pr.proveedor_codigo AS proveedorCodigo,
        pr.rubro_nombre AS rubroNombre,
        pr.rubro_id AS rubroId,
        pr.cantidad_articulos AS cantidadArticulos
      FROM mudras_proveedor_rubro pr
      WHERE pr.proveedor_id = ?
      ORDER BY pr.rubro_nombre
    `;

    const rows = await this.proveedoresRepository.query(query, [proveedorId]);

    return rows.map((row: any) => ({
      id: Number(row.id),
      proveedorId: Number(row.proveedorId ?? row.proveedor_id ?? proveedorId),
      proveedorNombre: row.proveedorNombre ?? row.proveedor_nombre ?? null,
      proveedorCodigo:
        row.proveedorCodigo != null ? Number(row.proveedorCodigo) : row.proveedor_codigo != null ? Number(row.proveedor_codigo) : null,
      rubroNombre: row.rubroNombre ?? row.rubro_nombre ?? null,
      rubroId:
        row.rubroId != null ? Number(row.rubroId) : row.rubro_id != null ? Number(row.rubro_id) : null,
      cantidadArticulos:
        row.cantidadArticulos != null
          ? Number(row.cantidadArticulos)
          : row.cantidad_articulos != null
            ? Number(row.cantidad_articulos)
            : null,
    }));
  }
}
