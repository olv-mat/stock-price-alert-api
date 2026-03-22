import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { AlertStatus } from 'src/modules/enum/alert-status.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'alerts' })
export class AlertEntity extends AbstractEntity {
  @Column({ length: 20, nullable: false })
  public ticket: string;

  @Column({ name: 'target_price', nullable: false })
  public targetPrice: number;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.PENDING })
  public status: AlertStatus;
}
