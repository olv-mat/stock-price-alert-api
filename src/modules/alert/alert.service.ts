import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { AlertFiltersDto } from './dtos/alert-filters.dto';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { UpdateAlertDto } from './dtos/update-alert.dto';
import { AlertEntity } from './entities/alert.entity';
import { AlertStatus } from './enum/alert-status.enum';
import { AlertNotFoundException } from './exceptions/alert-not-found.exception';
import { AlertJob } from './types/alert-job.type';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
    @InjectQueue('alerts') private readonly queue: Queue<AlertJob>,
  ) {}

  public findAll(
    sub: string,
    filters: AlertFiltersDto,
  ): Promise<[AlertEntity[], number]> {
    return this.findWithFilters(sub, filters);
  }

  public findOne(sub: string, id: string): Promise<AlertEntity> {
    return this.getById(sub, id);
  }

  public async create(sub: string, dto: CreateAlertDto): Promise<AlertEntity> {
    const alertEntity = await this.alertRepository.save({
      ...dto,
      user: { id: sub },
    });
    await this.addToQueue(sub, alertEntity.id);
    return alertEntity;
  }

  public async update(
    sub: string,
    id: string,
    dto: UpdateAlertDto,
  ): Promise<void> {
    const alertEntity = await this.getById(sub, id);
    await this.alertRepository.update(alertEntity.id, dto);
  }

  public async delete(sub: string, id: string): Promise<void> {
    const alertEntity = await this.getById(sub, id);
    await this.alertRepository.delete(alertEntity.id);
  }

  public async updateStatus(id: string, status: AlertStatus): Promise<void> {
    await this.alertRepository.update(id, { status: status });
  }

  private async findWithFilters(
    sub: string,
    filters: AlertFiltersDto,
  ): Promise<[AlertEntity[], number]> {
    const { status, ticker, page, limit } = filters;
    const skip = (page - 1) * limit;
    return this.alertRepository.findAndCount({
      where: {
        ...(status && { status: status }),
        ...(ticker && { ticker: ticker }),
        user: { id: sub },
      },
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private async getById(sub: string, id: string): Promise<AlertEntity> {
    const alertEntity = await this.alertRepository.findOne({
      where: { id: id, user: { id: sub } },
    });
    if (!alertEntity) throw new AlertNotFoundException();
    return alertEntity;
  }

  private async addToQueue(sub: string, id: string): Promise<void> {
    await this.queue.add(
      'job',
      {
        owner: sub,
        reference: id,
      },
      {
        repeat: {
          every: 10000,
        },
      },
    );
  }
}
