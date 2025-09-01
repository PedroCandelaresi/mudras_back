import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RubrosService } from './rubros.service';
import { Rubro } from './entities/rubro.entity';

@Resolver(() => Rubro)
export class RubrosResolver {
  constructor(private readonly rubrosService: RubrosService) {}

  @Query(() => [Rubro], { name: 'rubros' })
  findAll() {
    return this.rubrosService.findAll();
  }

  @Query(() => Rubro, { name: 'rubro' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rubrosService.findOne(id);
  }

  @Query(() => Rubro, { name: 'rubroPorNombre' })
  findByNombre(@Args('rubro') rubro: string) {
    return this.rubrosService.findByNombre(rubro);
  }
}
