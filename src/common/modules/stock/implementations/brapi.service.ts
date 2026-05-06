import { Inject, Injectable } from '@nestjs/common';
import Brapi from 'brapi';
import { StockService } from '../stock.service';
import { BRAPI_CLIENT } from './brapi.provider';

@Injectable()
export class BrapiServiceImplementation implements StockService {
  constructor(@Inject(BRAPI_CLIENT) private readonly brapi: Brapi) {}

  public async getCurrentPrice(ticket: string): Promise<number | undefined> {
    const quote = await this.brapi.quote.retrieve(ticket);
    const price = quote?.results?.[0]?.regularMarketPrice;
    if (price !== undefined && price !== null) {
      return price;
    }
  }
}
