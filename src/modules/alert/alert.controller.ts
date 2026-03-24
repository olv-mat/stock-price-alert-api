import { Controller, Get } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertResponseDto } from './dtos/alert-response.dto';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  public async findAll(): Promise<AlertResponseDto[]> {
    const alertEntities = await this.alertService.findAll();
    return AlertResponseDto.fromEntities(alertEntities);
  }
}
