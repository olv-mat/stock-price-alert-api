import { AlertStatus } from 'src/modules/alert/enum/alert-status.enum';
import { AlertEntity } from '../../entities/alert.entity';

export const makeAlertEntity = (
  override?: Partial<AlertEntity>,
): AlertEntity => ({
  id: 'f3b8c2d4-9e6a-4f71-a8c9-2d5b7e3c1a90',
  ticket: 'PETR4',
  targetPrice: 38.5,
  status: AlertStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});
