import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rubro } from './entities/rubro.entity';

@Injectable()
export class RubrosService {
  constructor(
    @InjectRepository(Rubro)
    private rubrosRepository: Repository<Rubro>,
  ) {}

  async findAll(): Promise<Rubro[]> {
    return this.rubrosRepository.find({
      order: { Id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Rubro> {
    return this.rubrosRepository.findOne({
      where: { Id: id },
    });
  }

  async findByNombre(rubro: string): Promise<Rubro> {
    return this.rubrosRepository.findOne({
      where: { Rubro: rubro },
    });
  }
}
