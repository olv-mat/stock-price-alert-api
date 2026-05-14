import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { AlertStatus } from 'src/modules/alert/enum/alert-status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'alerts' })
export class AlertEntity extends AbstractEntity {
  @Column({ length: 20, nullable: false })
  public ticker!: string;

  @Column({ type: 'float', name: 'target_price', nullable: false })
  public targetPrice!: number;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.PENDING })
  public status!: AlertStatus;

  @ManyToOne(() => UserEntity, (user) => user.alerts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  public user!: UserEntity;
}
