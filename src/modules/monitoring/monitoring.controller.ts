import { Controller, Get, Header } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  public metrics(): Promise<string> {
    return this.monitoringService.metrics();
  }
}
