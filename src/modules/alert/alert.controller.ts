import { Controller, Get } from '@nestjs/common';
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
}
