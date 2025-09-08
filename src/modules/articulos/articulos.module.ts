import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticulosService } from './articulos.service';
import { ArticulosResolver } from './articulos.resolver';
import { Articulo } from './entities/articulo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Articulo]), AuthModule],
  providers: [ArticulosResolver, ArticulosService],
  exports: [ArticulosService],
})
export class ArticulosModule {}
