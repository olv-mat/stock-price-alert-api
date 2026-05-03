import { Module } from '@nestjs/common';
import { BrapiProvider } from './implementations/brapi.provider';
import { BrapiServiceImplementation } from './implementations/brapi.service';
import { StockService } from './stock.service';

@Module({
  providers: [
    {
      provide: StockService,
      useClass: BrapiServiceImplementation,
    },
    BrapiProvider,
  ],
  exports: [StockService],
})
export class StockModule {}
