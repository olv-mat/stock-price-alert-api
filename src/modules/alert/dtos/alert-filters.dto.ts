import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AlertStatus } from '../enum/alert-status.enum';

export class AlertFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  public readonly ticker?: string;

  @IsOptional()
  @IsEnum(AlertStatus)
  public readonly status?: AlertStatus;
}
