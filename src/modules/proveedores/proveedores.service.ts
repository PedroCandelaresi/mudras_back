import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find({
      order: { IdProveedor: 'ASC' },
    });
  }
// console.log(this.proveedoresRepository.findOne({
//   where: { IdProveedor: id },
// }));
  async findOne(id: number): Promise<Proveedor> {
    return this.proveedoresRepository.findOne({
      where: { IdProveedor: id },
    });
  }

  async findByCodigo(codigo: number): Promise<Proveedor> {
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
}
