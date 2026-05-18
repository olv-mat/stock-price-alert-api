import { Inject, Injectable } from '@nestjs/common';
import Brapi from 'brapi';
import { StockNotFoundException } from '../exceptions/stock-not-found.exception';
import { StockPriceException } from '../exceptions/stock-price.exception';
import { StockService } from '../stock.service';
import { BRAPI_CLIENT } from './brapi.provider';

@Injectable()
export class BrapiServiceImplementation implements StockService {
  constructor(@Inject(BRAPI_CLIENT) private readonly brapi: Brapi) {}

  public async getCurrentPrice(ticker: string): Promise<number | undefined> {
    try {
      const quote = await this.brapi.quote.retrieve(ticker);
      const price = quote?.results?.[0]?.regularMarketPrice;
      if (price !== undefined && price !== null) {
        return price;
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Nenhum resultado encontrado')
      ) {
        throw new StockNotFoundException(ticker);
      }
      throw new StockPriceException();
    }
  }
}
