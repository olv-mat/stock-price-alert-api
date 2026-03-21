import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsNotEmpty()
  @IsString()
  public readonly ticket: string;

  @IsNotEmpty()
  @IsString()
  public readonly targetPrice: string;
}
