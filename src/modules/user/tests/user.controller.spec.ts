import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreatedResponseDto } from 'src/common/dtos/created-response.dto';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { makeAccessTokenPayload } from 'src/common/test/factories/access-token-payload.factory';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { makeCreateUserDto } from './factories/create-user.dto.factory';
import { makeUpdateUserDto } from './factories/update-user.dto.factory';
import { makeUserEntity } from './factories/user.entity.factory';

describe('UserController', () => {
  let userController: UserController;
  const userServiceMock = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userController = new UserController(
      userServiceMock as unknown as UserService,
    );
  });

  describe('find', () => {
    it('should return a mapped user', async () => {
      const user = makeAccessTokenPayload();
      userServiceMock.find.mockResolvedValue(makeUserEntity());
      const response = await userController.find(user);
      expect(userServiceMock.find).toHaveBeenCalledWith(user.sub);
      expect(response instanceof UserResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const user = makeAccessTokenPayload();
      userServiceMock.find.mockRejectedValue(new BadRequestException());
      await expect(userController.find(user)).rejects.toThrow(
        BadRequestException,
      );
      expect(userServiceMock.find).toHaveBeenCalledWith(user.sub);
    });
  });

  describe('create', () => {
    it('should return a created response', async () => {
      const dto = makeCreateUserDto();
      userServiceMock.create.mockResolvedValue(makeUserEntity());
      const response = await userController.create(dto);
      expect(userServiceMock.create).toHaveBeenCalledWith(dto);
      expect(response instanceof CreatedResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeCreateUserDto();
      userServiceMock.create.mockRejectedValue(new ConflictException());
      await expect(userController.create(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should return a default response', async () => {
      const user = makeAccessTokenPayload();
      const updateUserDto = makeUpdateUserDto();
      userServiceMock.update.mockResolvedValue(undefined);
      const response = await userController.update(user, updateUserDto);
      expect(userServiceMock.update).toHaveBeenCalledWith(
        user.sub,
        updateUserDto,
      );
      expect(response instanceof DefaultResponseDto).toBe(true);
    });

    it.each([new NotFoundException(), new ConflictException()])(
      'should propagate service exceptions',
      async (exception) => {
        const user = makeAccessTokenPayload();
        const updateUserDto = makeUpdateUserDto();
        userServiceMock.update.mockRejectedValue(exception);
        await expect(
          userController.update(user, updateUserDto),
        ).rejects.toThrow(exception);
        expect(userServiceMock.update).toHaveBeenCalledWith(
          user.sub,
          updateUserDto,
        );
      },
    );
  });

  describe('delete', () => {
    it('should return a default response', async () => {
      const user = makeAccessTokenPayload();
      userServiceMock.delete.mockResolvedValue(undefined);
      const response = await userController.delete(user);
      expect(userServiceMock.delete).toHaveBeenCalledWith(user.sub);
      expect(response instanceof DefaultResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const user = makeAccessTokenPayload();
      userServiceMock.delete.mockRejectedValue(new NotFoundException());
      await expect(userController.delete(user)).rejects.toThrow(
        NotFoundException,
      );
      expect(userServiceMock.delete).toHaveBeenCalledWith(user.sub);
    });
  });
});
