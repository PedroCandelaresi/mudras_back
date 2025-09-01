import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosService } from './articulos.service';
import { ArticulosResolver } from './articulos.resolver';
import { Articulo } from './entities/articulo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo])],
  providers: [ArticulosResolver, ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
