import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
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
          useValue: { find: jest.fn(), findOneBy: jest.fn() },
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
    it('should return a list of users', async () => {
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

  describe('findOne', () => {
    it('should return a user', async () => {
      const { userRepositoryMock, userService } = context;
      const { id } = makeUuidDto();
      const userEntity = makeUserEntity();
      const spy = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValue(userEntity);
      const response = await userService.findOne(id);
      expect(spy).toHaveBeenCalledWith({ id: id });
      expect(response).toEqual(userEntity);
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userRepositoryMock, userService } = context;
      const { id } = makeUuidDto();
      const spy = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValue(null);
      await expect(userService.findOne(id)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledWith({ id: id });
    });
  });
});
