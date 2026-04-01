import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { UuidDto } from 'src/common/dtos/uuid.dto';
import {
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOperation,
} from 'src/common/swagger/decorators.swagger';
import { AlertService } from './alert.service';
import { AlertResponseDto } from './dtos/alert-response.dto';
import { CreateAlertDto } from './dtos/create-alert.dto';

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
  @SwaggerOperation('Retrieve a specific alert')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async findOne(@Param() { id }: UuidDto): Promise<AlertResponseDto> {
    const alertEntity = await this.alertService.findOne(id);
    return AlertResponseDto.fromEntity(alertEntity);
  }

  @Post()
  @SwaggerOperation('Create a new alert')
  @SwaggerInternalServerError()
  public async create(
    @Body() dto: CreateAlertDto,
  ): Promise<CreatedResponseDto> {
    const { id } = await this.alertService.create(dto);
    return CreatedResponseDto.create(id, 'Alert created successfully');
  }
}
