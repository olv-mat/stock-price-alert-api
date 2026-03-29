import { AlertStatus } from 'src/modules/alert/enum/alert-status.enum';
import { AlertEntity } from '../entities/alert.entity';

type AlertResponseProperties = {
  id: string;
  ticket: string;
  targetPrice: number;
  status: AlertStatus;
};

export class AlertResponseDto {
  public readonly id: string;
  public readonly ticket: string;
  public readonly targetPrice: number;
  public readonly status: AlertStatus;

  private constructor(properties: AlertResponseProperties) {
    this.id = properties.id;
    this.ticket = properties.ticket;
    this.targetPrice = properties.targetPrice;
    this.status = properties.status;
  }

  public static fromEntities(entities: AlertEntity[]): AlertResponseDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }

  public static fromEntity(entity: AlertEntity): AlertResponseDto {
    return new AlertResponseDto({
      id: entity.id,
      ticket: entity.ticket,
      targetPrice: entity.targetPrice,
      status: entity.status,
    });
  }
}
