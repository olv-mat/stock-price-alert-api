import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { UuidDto } from 'src/common/dtos/uuid.dto';
import {
  SwaggerBearerAuth,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOperation,
} from 'src/common/swagger/decorators.swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AlertService } from './alert.service';
import { AlertResponseDto } from './dtos/alert-response.dto';
import { CreateAlertDto } from './dtos/create-alert.dto';

@Controller('alerts')
@UseGuards(JwtGuard)
@SwaggerBearerAuth()
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

  @Delete(':id')
  @SwaggerOperation('Delete a specific alert')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async delete(@Param() { id }: UuidDto): Promise<DefaultResponseDto> {
    await this.alertService.delete(id);
    return DefaultResponseDto.create('Alert deleted successfully');
  }
}
