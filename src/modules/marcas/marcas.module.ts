import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';
// import { MarcasService } from './marcas.service';
// import { MarcasResolver } from './marcas.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Marca])],
    providers: [
        // MarcasService, 
        // MarcasResolver
    ],
    exports: [TypeOrmModule],
})
export class MarcasModule { }
