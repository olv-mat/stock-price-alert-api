import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';
import { makeUserEntity } from './factories/user.entity.factory';

type UserServiceContext = {
  userRepositoryMock: Repository<UserEntity>;
  userService: UserService;
};

describe('UserService', () => {
  let context: UserServiceContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: { find: jest.fn() },
        },
        UserService,
      ],
    }).compile();
    context = {
      userRepositoryMock: module.get(getRepositoryToken(UserEntity)),
      userService: module.get(UserService),
    };
  });

  describe('findAll', () => {
    it('should return a list of alerts', async () => {
      const { userRepositoryMock, userService } = context;
      const userEntities = [makeUserEntity()];
      const spy = jest
        .spyOn(userRepositoryMock, 'find')
        .mockResolvedValue(userEntities);
      const response = await userService.findAll();
      expect(spy).toHaveBeenCalledWith();
      expect(response).toEqual(userEntities);
    });
  });
});
