export class CreatedResponseDto {
  public id: string;
  public message: string;

  private constructor(id: string, message: string) {
    this.id = id;
    this.message = message;
  }

  public static create(id: string, message: string): CreatedResponseDto {
    return new CreatedResponseDto(id, message);
  }
}
