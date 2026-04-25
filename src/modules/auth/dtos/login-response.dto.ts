export class LoginResponseDto {
  public readonly token: string;

  private constructor(token: string) {
    this.token = token;
  }

  public static create(token: string): LoginResponseDto {
    return new LoginResponseDto(token);
  }
}
