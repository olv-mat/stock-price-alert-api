import { AlertFiltersDto } from '../../dtos/alert-filters.dto';
import { AlertStatus } from '../../enum/alert-status.enum';

export const makeAlertFiltersDto = (
  override?: Partial<AlertFiltersDto>,
): AlertFiltersDto => {
  return Object.assign(new AlertFiltersDto(), {
    page: 1,
    limit: 10,
    ticker: 'PETR4',
    status: AlertStatus.PENDING,
    ...override,
  });
};
