import { IsUUID } from 'class-validator';

export class UuidDto {
  @IsUUID()
  public readonly id: string;
}
