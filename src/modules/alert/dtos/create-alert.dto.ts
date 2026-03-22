import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsNotEmpty()
  @IsString()
  public readonly ticket: string;

  @IsNumber()
  @IsPositive()
  public readonly targetPrice: number;
}
