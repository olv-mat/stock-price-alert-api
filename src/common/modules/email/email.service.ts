export abstract class EmailService {
  public abstract send(subject: string, text: string): Promise<void>;
}
