import { UpdateAlertDto } from '../../dtos/update-alert.dto';

export const makeUpdateAlertDto = (
  override?: Partial<UpdateAlertDto>,
): UpdateAlertDto => {
  return Object.assign(new UpdateAlertDto(), {
    targetPrice: 38,
    ...override,
  });
};
