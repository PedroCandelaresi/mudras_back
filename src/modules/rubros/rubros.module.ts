import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RubrosService } from './rubros.service';
import { RubrosResolver } from './rubros.resolver';
import { Rubro } from './entities/rubro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rubro])],
  providers: [RubrosResolver, RubrosService],
  exports: [RubrosService],
})
export class RubrosModule {}
