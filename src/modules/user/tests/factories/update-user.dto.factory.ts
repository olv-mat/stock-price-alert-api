import { UpdateUserDto } from '../../dtos/update-user.dto';

export const makeUpdateUserDto = (
  override?: Partial<UpdateUserDto>,
): UpdateUserDto => {
  return Object.assign(new UpdateUserDto(), {
    ...override,
  });
};
