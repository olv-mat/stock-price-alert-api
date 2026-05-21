import { AlertStatus } from 'src/modules/alert/enums/alert-status.enum';
import { makeUserEntity } from 'src/modules/user/tests/factories/user.entity.factory';
import { AlertEntity } from '../../entities/alert.entity';

export const makeAlertEntity = (
  override?: Partial<AlertEntity>,
): AlertEntity => ({
  id: 'f3b8c2d4-9e6a-4f71-a8c9-2d5b7e3c1a90',
  ticker: 'PETR4',
  targetPrice: 38.5,
  status: AlertStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: makeUserEntity(),
  ...override,
});
