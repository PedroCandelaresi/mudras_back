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
var ArticulosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticulosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const articulo_entity_1 = require("./entities/articulo.entity");
let ArticulosService = ArticulosService_1 = class ArticulosService {
    constructor(articulosRepository) {
        this.articulosRepository = articulosRepository;
        this.logger = new common_1.Logger(ArticulosService_1.name);
    }
    async findAll() {
        return this.articulosRepository.find({
            relations: ['proveedor'],
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        return this.articulosRepository.findOne({
            where: { id },
            relations: ['proveedor'],
        });
    }
    async findByCodigo(codigo) {
        return this.articulosRepository.findOne({
            where: { Codigo: codigo },
            relations: ['proveedor'],
        });
    }
    async findByRubro(rubro) {
        return this.articulosRepository.find({
            where: { Rubro: rubro },
            relations: ['proveedor'],
            order: { Descripcion: 'ASC' },
        });
    }
    async findByDescripcion(descripcion) {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Descripcion LIKE :descripcion', { descripcion: `%${descripcion}%` })
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findByProveedor(idProveedor) {
        return this.articulosRepository.find({
            where: { idProveedor },
            relations: ['proveedor'],
            order: { Descripcion: 'ASC' },
        });
    }
    async findConStock() {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Stock > 0')
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findSinStock() {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Stock <= 0 OR articulo.Stock IS NULL')
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findStockBajo() {
        return this.articulosRepository
            .createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor')
            .where('articulo.Stock <= articulo.StockMinimo AND articulo.StockMinimo > 0')
            .orderBy('articulo.Descripcion', 'ASC')
            .getMany();
    }
    async findEnPromocion() {
        return this.articulosRepository.find({
            where: { EnPromocion: true },
            relations: ['proveedor'],
            order: { Descripcion: 'ASC' },
        });
    }
    async crear(crearArticuloDto) {
        const articuloExistente = await this.articulosRepository.findOne({
            where: { Codigo: crearArticuloDto.Codigo }
        });
        if (articuloExistente) {
            throw new common_1.BadRequestException(`Ya existe un artículo con el código ${crearArticuloDto.Codigo}`);
        }
        const articulo = this.articulosRepository.create({
            ...crearArticuloDto,
        });
        return this.articulosRepository.save(articulo);
    }
    async actualizar(actualizarArticuloDto) {
        const articulo = await this.articulosRepository.findOne({
            where: { id: actualizarArticuloDto.id }
        });
        if (!articulo) {
            throw new common_1.NotFoundException(`Artículo con ID ${actualizarArticuloDto.id} no encontrado`);
        }
        if (actualizarArticuloDto.Codigo && actualizarArticuloDto.Codigo !== articulo.Codigo) {
            const articuloExistente = await this.articulosRepository.findOne({
                where: { Codigo: actualizarArticuloDto.Codigo }
            });
            if (articuloExistente) {
                throw new common_1.BadRequestException(`Ya existe un artículo con el código ${actualizarArticuloDto.Codigo}`);
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
    async eliminar(id) {
        const articulo = await this.articulosRepository.findOne({ where: { id } });
        if (!articulo) {
            throw new common_1.NotFoundException(`Artículo con ID ${id} no encontrado`);
        }
        await this.articulosRepository.delete(id);
        return true;
    }
    async buscarConFiltros(filtros) {
        this.logger.debug(`buscarConFiltros -> pagina=${filtros.pagina} limite=${filtros.limite} ordenarPor=${filtros.ordenarPor} dir=${filtros.direccionOrden} busqueda=${filtros.busqueda ?? ''}`);
        const queryBuilder = this.articulosRepository.createQueryBuilder('articulo')
            .leftJoinAndSelect('articulo.proveedor', 'proveedor');
        if (filtros.busqueda) {
            queryBuilder.andWhere('(articulo.Descripcion LIKE :busqueda OR articulo.Codigo LIKE :busqueda OR articulo.Marca LIKE :busqueda)', { busqueda: `%${filtros.busqueda}%` });
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
        const total = await queryBuilder.getCount();
        const articulos = await queryBuilder
            .orderBy(`articulo.${filtros.ordenarPor}`, filtros.direccionOrden)
            .skip(filtros.pagina * filtros.limite)
            .take(filtros.limite)
            .getMany();
        this.logger.debug(`buscarConFiltros <- devueltos=${articulos.length} de total=${total}`);
        return { articulos, total };
    }
    async obtenerEstadisticas() {
        const [totalArticulos, articulosActivos, articulosConStock, articulosSinStock, articulosStockBajo, articulosEnPromocion, articulosPublicadosEnTienda, valorTotalStock] = await Promise.all([
            this.articulosRepository.count(),
            this.articulosRepository.count(),
            this.articulosRepository.count({ where: { Deposito: (0, typeorm_2.Between)(0.01, 999999) } }),
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
    async buscarPorCodigoBarras(codigoBarras) {
        return this.articulosRepository.findOne({
            where: { Codigo: codigoBarras },
            relations: ['proveedor']
        });
    }
    async actualizarStock(id, nuevoStock) {
        const articulo = await this.articulosRepository.findOne({ where: { id } });
        if (!articulo) {
            throw new common_1.NotFoundException(`Artículo con ID ${id} no encontrado`);
        }
        await this.articulosRepository.update(id, { Deposito: nuevoStock });
        return this.articulosRepository.findOne({ where: { id }, relations: ['proveedor'] });
    }
};
exports.ArticulosService = ArticulosService;
exports.ArticulosService = ArticulosService = ArticulosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(articulo_entity_1.Articulo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticulosService);
//# sourceMappingURL=articulos.service.js.map