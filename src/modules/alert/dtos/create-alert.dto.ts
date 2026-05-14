import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsNotEmpty()
  @IsString()
  public readonly ticker!: string;

  @IsNumber()
  @IsPositive()
  public readonly targetPrice!: number;
}
