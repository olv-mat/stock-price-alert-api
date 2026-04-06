import { UserEntity } from '../../entities/user.entity';

export const makeUserEntity = (override?: Partial<UserEntity>): UserEntity => ({
  id: '8ca0387e-9dc5-47e5-8bac-82463d9e612a',
  name: 'John Doe',
  email: 'john.doe@test.com',
  password: '',
  alerts: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...override,
});
