import { CreateUserDto } from '../../dtos/create-user.dto';

export const makeCreateUserDto = (
  override?: Partial<CreateUserDto>,
): CreateUserDto => {
  return Object.assign(new CreateUserDto(), {
    name: 'John Doe',
    email: 'john.doe@test.com',
    password: '@JohnDoe123',
    ...override,
  });
};
