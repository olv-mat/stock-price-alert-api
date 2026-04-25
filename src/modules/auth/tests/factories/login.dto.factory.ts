import { LoginDto } from '../../dtos/login.dto';

export const makeLoginDto = (override?: Partial<LoginDto>): LoginDto => {
  return Object.assign(new LoginDto(), {
    email: 'john.doe@test.com',
    password: '@JohnDoe123',
    ...override,
  });
};
