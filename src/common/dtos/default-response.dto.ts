export class DefaultResponseDto {
  public readonly message: string;

  private constructor(message: string) {
    this.message = message;
  }

  public static create(message: string): DefaultResponseDto {
    return new DefaultResponseDto(message);
  }
}
