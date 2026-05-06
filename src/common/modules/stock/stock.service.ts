export abstract class StockService {
  public abstract getCurrentPrice(ticket: string): Promise<number | undefined>;
}
