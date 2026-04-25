export abstract class CredentialService {
  public abstract sign<T extends object>(payload: T): Promise<string>;
}
