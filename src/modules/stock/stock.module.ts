import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockResolver } from './stock.resolver';
import { Stock } from './entities/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers: [StockResolver, StockService],
  exports: [StockService],
})
export class StockModule {}
