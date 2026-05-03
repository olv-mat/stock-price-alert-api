import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { AlertEntity } from './entities/alert.entity';
import { AlertJob } from './types/alert-job.type';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
    @InjectQueue('alerts') private readonly queue: Queue<AlertJob>,
  ) {}

  public findAll(sub: string): Promise<AlertEntity[]> {
    return this.alertRepository.find({ where: { user: { id: sub } } });
  }

  public findOne(sub: string, id: string): Promise<AlertEntity> {
    return this.getById(sub, id);
  }

  public async create(sub: string, dto: CreateAlertDto): Promise<AlertEntity> {
    const alertEntity = await this.alertRepository.save({
      ...dto,
      user: { id: sub },
    });
    await this.addToQueue(alertEntity);
    return alertEntity;
  }

  public async delete(sub: string, id: string): Promise<void> {
    const alertEntity = await this.getById(sub, id);
    await this.alertRepository.delete(alertEntity.id);
  }

  private async getById(sub: string, id: string): Promise<AlertEntity> {
    const alertEntity = await this.alertRepository.findOne({
      where: { id: id, user: { id: sub } },
    });
    if (!alertEntity) throw new NotFoundException('Alert not found');
    return alertEntity;
  }

  private async addToQueue(entity: AlertEntity): Promise<void> {
    await this.queue.add(
      'job',
      {
        id: entity.id,
        ticket: entity.ticket,
        targetPrice: entity.targetPrice,
      },
      {
        repeat: {
          every: 10000,
        },
      },
    );
  }
}
