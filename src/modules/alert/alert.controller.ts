import { Controller, Get, Param } from '@nestjs/common';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import {
  SwaggerInternalServerError,
  SwaggerOperation,
} from 'src/common/swagger/decorators.swagger';
import { AlertService } from './alert.service';
import { AlertResponseDto } from './dtos/alert-response.dto';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @SwaggerOperation('Retrieve all alerts')
  @SwaggerInternalServerError()
  public async findAll(): Promise<AlertResponseDto[]> {
    const alertEntities = await this.alertService.findAll();
    return AlertResponseDto.fromEntities(alertEntities);
  }

  @Get(':id')
  public async findOne(@Param() { id }: UuidDto): Promise<AlertResponseDto> {
    const alertEntity = await this.alertService.findOne(id);
    return AlertResponseDto.fromEntity(alertEntity);
  }
}
