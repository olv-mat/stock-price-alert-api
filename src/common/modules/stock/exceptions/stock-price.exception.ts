import { InternalServerErrorException } from '@nestjs/common';

export class StockPriceException extends InternalServerErrorException {
  constructor() {
    super('Failed to fetch stock price');
  }
}
