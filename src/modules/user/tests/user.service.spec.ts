import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CryptographyService } from 'src/common/modules/cryptography/cryptography.service';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';
import { makeCreateUserDto } from './factories/create-user.dto.factory';
import { makeUpdateUserDto } from './factories/update-user.dto.factory';
import { makeUserEntity } from './factories/user.entity.factory';

type UserServiceContext = {
  userService: UserService;
  userRepositoryMock: Repository<UserEntity>;
  cryptographyServiceMock: CryptographyService;
};

describe('UserService', () => {
  let context: UserServiceContext;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            exists: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CryptographyService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();
    context = {
      userService: module.get(UserService),
      userRepositoryMock: module.get(getRepositoryToken(UserEntity)),
      cryptographyServiceMock: module.get(CryptographyService),
    };
  });

  describe('find', () => {
    it('should return a user', async () => {
      const { userService, userRepositoryMock } = context;
      const { id } = makeUuidDto();
      const userEntity = makeUserEntity();
      const spy = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValue(userEntity);
      const response = await userService.find(id);
      expect(spy).toHaveBeenCalledWith({ id: id });
      expect(response).toEqual(userEntity);
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepositoryMock } = context;
      const { id } = makeUuidDto();
      const spy = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValue(null);
      await expect(userService.find(id)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledWith({ id: id });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const { userService, userRepositoryMock, cryptographyServiceMock } =
        context;
      const dto = makeCreateUserDto();
      const userEntity = makeUserEntity();
      const spies = {
        exists: jest
          .spyOn(userRepositoryMock, 'exists')
          .mockResolvedValue(false),
        hash: jest.spyOn(cryptographyServiceMock, 'hash').mockResolvedValue(''),
        save: jest
          .spyOn(userRepositoryMock, 'save')
          .mockResolvedValue(userEntity),
      };
      const response = await userService.create(dto);
      expect(spies.exists).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(spies.hash).toHaveBeenCalledWith(dto.password);
      expect(spies.save).toHaveBeenCalledWith({
        ...dto,
        password: '',
      });
      expect(response).toEqual({
        ...userEntity,
        password: '',
      });
    });

    it('should throw a conflict excpetion when email already in use', async () => {
      const { userService, userRepositoryMock, cryptographyServiceMock } =
        context;
      const dto = makeCreateUserDto();
      const spies = {
        exists: jest
          .spyOn(userRepositoryMock, 'exists')
          .mockResolvedValue(true),
        hash: jest.spyOn(cryptographyServiceMock, 'hash'),
        save: jest.spyOn(userRepositoryMock, 'save'),
      };
      await expect(userService.create(dto)).rejects.toThrow(ConflictException);
      expect(spies.hash).not.toHaveBeenCalled();
      expect(spies.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const { userService, userRepositoryMock, cryptographyServiceMock } =
        context;
      const { id } = makeUuidDto();
      const dto = makeUpdateUserDto({
        name: 'Luna Doe',
        email: 'luna.doe@test.com',
        password: '@LunaDoe123',
      });
      const userEntity = makeUserEntity();
      const spies = {
        findOneBy: jest
          .spyOn(userRepositoryMock, 'findOneBy')
          .mockResolvedValue(userEntity),
        exists: jest
          .spyOn(userRepositoryMock, 'exists')
          .mockResolvedValue(false),
        hash: jest.spyOn(cryptographyServiceMock, 'hash').mockResolvedValue(''),
        update: jest.spyOn(userRepositoryMock, 'update'),
      };
      await userService.update(id, dto);
      expect(spies.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(spies.exists).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(spies.hash).toHaveBeenCalledWith(dto.password);
      expect(spies.update).toHaveBeenCalledWith(userEntity.id, {
        ...dto,
        password: '',
      });
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepositoryMock, cryptographyServiceMock } =
        context;
      const { id } = makeUuidDto();
      const dto = makeUpdateUserDto({ email: 'john.doe@changed.com' });
      const spies = {
        findOneBy: jest
          .spyOn(userRepositoryMock, 'findOneBy')
          .mockResolvedValue(null),
        exists: jest.spyOn(userRepositoryMock, 'exists'),
        hash: jest.spyOn(cryptographyServiceMock, 'hash'),
        update: jest.spyOn(userRepositoryMock, 'update'),
      };
      await expect(userService.update(id, dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(spies.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(spies.exists).not.toHaveBeenCalled();
      expect(spies.hash).not.toHaveBeenCalled();
      expect(spies.update).not.toHaveBeenCalled();
    });

    it('should throw a conflict excpetion when email already in use', async () => {
      const { userService, userRepositoryMock, cryptographyServiceMock } =
        context;
      const { id } = makeUuidDto();
      const dto = makeUpdateUserDto({ email: 'john.doe@changed.com' });
      const userEntity = makeUserEntity();
      const spies = {
        findOneBy: jest
          .spyOn(userRepositoryMock, 'findOneBy')
          .mockResolvedValue(userEntity),
        exists: jest
          .spyOn(userRepositoryMock, 'exists')
          .mockResolvedValue(true),
        hash: jest.spyOn(cryptographyServiceMock, 'hash'),
        update: jest.spyOn(userRepositoryMock, 'update'),
      };
      await expect(userService.update(id, dto)).rejects.toThrow(
        ConflictException,
      );
      expect(spies.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(spies.exists).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(spies.hash).not.toHaveBeenCalled();
      expect(spies.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const { userService, userRepositoryMock } = context;
      const { id } = makeUuidDto();
      const userEntity = makeUserEntity();
      const spies = {
        findOneBy: jest
          .spyOn(userRepositoryMock, 'findOneBy')
          .mockResolvedValue(userEntity),
        delete: jest.spyOn(userRepositoryMock, 'delete'),
      };
      await userService.delete(id);
      expect(spies.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(spies.delete).toHaveBeenCalledWith(userEntity.id);
    });

    it('should throw a not found exception when user does not exist', async () => {
      const { userService, userRepositoryMock } = context;
      const { id } = makeUuidDto();
      const spies = {
        findOneBy: jest
          .spyOn(userRepositoryMock, 'findOneBy')
          .mockResolvedValue(null),
        delete: jest.spyOn(userRepositoryMock, 'delete'),
      };
      await expect(userService.delete(id)).rejects.toThrow(NotFoundException);
      expect(spies.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(spies.delete).not.toHaveBeenCalled();
    });
  });
});
