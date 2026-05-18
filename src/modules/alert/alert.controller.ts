import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FromRequest } from 'src/common/decorators/from-request.decorator';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { UuidDto } from 'src/common/dtos/uuid.dto';
import { AccessTokenPayload } from 'src/common/modules/credential/contracts/access-token-payload';
import {
  SwaggerBearerAuth,
  SwaggerCustomResponse,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOperation,
  SwaggerUnauthorized,
} from 'src/common/swagger/decorators.swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AlertService } from './alert.service';
import { AlertFiltersDto } from './dtos/alert-filters.dto';
import { AlertResponseDto } from './dtos/alert-response.dto';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { UpdateAlertDto } from './dtos/update-alert.dto';
import { AlertStatus } from './enum/alert-status.enum';

@Controller('alerts')
@UseGuards(JwtGuard)
@SwaggerBearerAuth()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get()
  @SwaggerOperation(
    'Retrieve all alerts for the current user, with pagination and filters',
  )
  @SwaggerCustomResponse({
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            ticker: {
              type: 'string',
            },
            targetPrice: {
              type: 'number',
            },
            status: {
              type: AlertStatus,
              example: AlertStatus.PENDING,
            },
          },
        },
      },
      meta: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number',
            example: 1,
          },
          totalPages: {
            type: 'number',
            example: 1,
          },
          currentPage: {
            type: 'number',
            example: 1,
          },
          itemsPerPage: {
            type: 'number',
            example: 10,
          },
        },
      },
    },
  })
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerInternalServerError()
  public async findAll(
    @FromRequest('user') user: AccessTokenPayload,
    @Query() filters: AlertFiltersDto,
  ): Promise<PaginatedResponseDto> {
    const [alertEntities, total] = await this.alertService.findAll(
      user.sub,
      filters,
    );
    return PaginatedResponseDto.create({
      data: AlertResponseDto.fromEntities(alertEntities),
      total: total,
      page: filters.page,
      limit: filters.limit,
    });
  }

  @Get(':id')
  @SwaggerOperation('Retrieve a specific alert for the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async findOne(
    @FromRequest('user') user: AccessTokenPayload,
    @Param() { id }: UuidDto,
  ): Promise<AlertResponseDto> {
    const alertEntity = await this.alertService.findOne(user.sub, id);
    return AlertResponseDto.fromEntity(alertEntity);
  }

  @Post()
  @SwaggerOperation('Create an alert for the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerInternalServerError()
  public async create(
    @FromRequest('user') user: AccessTokenPayload,
    @Body() dto: CreateAlertDto,
  ): Promise<CreatedResponseDto> {
    const { id } = await this.alertService.create(user.sub, dto);
    return CreatedResponseDto.create(id, 'Alert created successfully');
  }

  @Patch(':id')
  @SwaggerOperation('Update a specific alert for the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async update(
    @FromRequest('user') user: AccessTokenPayload,
    @Param() { id }: UuidDto,
    @Body() dto: UpdateAlertDto,
  ): Promise<DefaultResponseDto> {
    await this.alertService.update(user.sub, id, dto);
    return DefaultResponseDto.create('Alert updated successfully');
  }

  @Delete(':id')
  @SwaggerOperation('Delete a specific alert for the current user')
  @SwaggerUnauthorized('Invalid, expired, or missing token')
  @SwaggerNotFound('Alert not found')
  @SwaggerInternalServerError()
  public async delete(
    @FromRequest('user') user: AccessTokenPayload,
    @Param() { id }: UuidDto,
  ): Promise<DefaultResponseDto> {
    await this.alertService.delete(user.sub, id);
    return DefaultResponseDto.create('Alert deleted successfully');
  }
}
