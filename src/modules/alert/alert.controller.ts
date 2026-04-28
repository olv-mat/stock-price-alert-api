import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FromRequest } from 'src/common/decorators/from-request.decorator';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { UuidDto } from 'src/common/dtos/uuid.dto';
import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';
import {
  SwaggerBearerAuth,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOperation,
  SwaggerUnauthorized,
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
  @SwaggerOperation('Retrieve all alerts for the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerInternalServerError()
  public async findAll(
    @FromRequest('user') user: AccessTokenPayload,
  ): Promise<AlertResponseDto[]> {
    const alertEntities = await this.alertService.findAll(user.sub);
    return AlertResponseDto.fromEntities(alertEntities);
  }

  @Get(':id')
  @SwaggerOperation('Retrieve a specific alert')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async findOne(@Param() { id }: UuidDto): Promise<AlertResponseDto> {
    const alertEntity = await this.alertService.findOne(id);
    return AlertResponseDto.fromEntity(alertEntity);
  }

  @Post()
  @SwaggerOperation('Create a new alert')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerInternalServerError()
  public async create(
    @FromRequest('user') user: AccessTokenPayload,
    @Body() dto: CreateAlertDto,
  ): Promise<CreatedResponseDto> {
    const { id } = await this.alertService.create(user.sub, dto);
    return CreatedResponseDto.create(id, 'Alert created successfully');
  }

  @Delete(':id')
  @SwaggerOperation('Delete a specific alert')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async delete(@Param() { id }: UuidDto): Promise<DefaultResponseDto> {
    await this.alertService.delete(id);
    return DefaultResponseDto.create('Alert deleted successfully');
  }
}
