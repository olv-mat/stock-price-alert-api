import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  public readonly email!: string;

  @IsNotEmpty()
  @IsString()
  public readonly password!: string;
}
