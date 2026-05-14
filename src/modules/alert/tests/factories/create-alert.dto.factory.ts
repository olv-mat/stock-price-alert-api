import { CreateAlertDto } from '../../dtos/create-alert.dto';

export const makeCreateAlertDto = (
  override?: Partial<CreateAlertDto>,
): CreateAlertDto => {
  return Object.assign(new CreateAlertDto(), {
    ticker: 'PETR4',
    targetPrice: 38.5,
    ...override,
  });
};
