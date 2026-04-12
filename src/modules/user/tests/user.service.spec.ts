import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';
import { makeCreateUserDto } from './factories/create-user.dto.factory';
import { makeUserEntity } from './factories/user.entity.factory';

type UserServiceContext = {
  userRepositoryMock: Repository<UserEntity>;
  cryptographyServiceMock: CryptographyService;
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
          useValue: { find: jest.fn(), findOneBy: jest.fn(), save: jest.fn() },
        },
        {
          provide: CryptographyService,
          useValue: { hash: jest.fn() },
        },
        UserService,
      ],
    }).compile();
    context = {
      userRepositoryMock: module.get(getRepositoryToken(UserEntity)),
      cryptographyServiceMock: module.get(CryptographyService),
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

  describe('create', () => {
    it('should create a new user', async () => {
      const { userRepositoryMock, cryptographyServiceMock, userService } =
        context;
      const dto = makeCreateUserDto();
      const userEntity = makeUserEntity();
      const findOneBySpy = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValue(null);
      const hashSpy = jest
        .spyOn(cryptographyServiceMock, 'hash')
        .mockResolvedValue('');
      const saveSpy = jest
        .spyOn(userRepositoryMock, 'save')
        .mockResolvedValue(userEntity);
      const response = await userService.create(dto);
      expect(findOneBySpy).toHaveBeenCalledWith({ email: dto.email });
      expect(hashSpy).toHaveBeenCalledWith(dto.password);
      expect(saveSpy).toHaveBeenCalledWith({
        ...dto,
        password: '',
      });
      expect(response).toEqual({
        ...userEntity,
        password: '',
      });
    });

    it('should throw a conflict excpetion when email already in use', async () => {
      const { userRepositoryMock, cryptographyServiceMock, userService } =
        context;
      const dto = makeCreateUserDto();
      jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValue(makeUserEntity());
      const hashSpy = jest.spyOn(cryptographyServiceMock, 'hash');
      const saveSpy = jest.spyOn(userRepositoryMock, 'save');
      await expect(userService.create(dto)).rejects.toThrow(ConflictException);
      expect(hashSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
