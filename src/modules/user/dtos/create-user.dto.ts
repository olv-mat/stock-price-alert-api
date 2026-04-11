import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;

  @IsEmail()
  @IsNotEmpty()
  public readonly email!: string;

  @IsStrongPassword()
  @IsNotEmpty()
  public readonly password!: string;
}
