import { Controller, Get, Header } from '@nestjs/common';
import {
  SwaggerInternalServerError,
  SwaggerOperation,
} from 'src/common/swagger/decorators.swagger';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @SwaggerOperation('Retrieve application metrics')
  @SwaggerInternalServerError()
  public metrics(): Promise<string> {
    return this.monitoringService.metrics();
  }
}
