import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertEntity } from './entities/alert.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly alertRepository: Repository<AlertEntity>,
  ) {}

  public findAll(): Promise<AlertEntity[]> {
    return this.alertRepository.find();
  }

  public findOne(id: string): Promise<AlertEntity> {
    return this.getById(id);
  }

  private async getById(id: string): Promise<AlertEntity> {
    const alertEntity = await this.alertRepository.findOneBy({ id: id });
    if (!alertEntity) throw new NotFoundException('Alert not found');
    return alertEntity;
  }
}
