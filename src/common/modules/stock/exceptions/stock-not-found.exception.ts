import { NotFoundException } from '@nestjs/common';

export class StockNotFoundException extends NotFoundException {
  constructor(ticker: string) {
    super(`Stock with ticker "${ticker}" not found`);
  }
}
