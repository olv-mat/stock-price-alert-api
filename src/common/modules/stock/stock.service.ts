export abstract class StockService {
  public abstract getCurrentPrice(ticker: string): Promise<number | undefined>;
}
