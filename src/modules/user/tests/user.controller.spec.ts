import { BadRequestException } from '@nestjs/common';
import { makeUuidDto } from 'src/common/test/factories/uuid.dto.factory';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { makeUserEntity } from './factories/user.entity.factory';

describe('UserController', () => {
  let userController: UserController;
  const userServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userController = new UserController(
      userServiceMock as unknown as UserService,
    );
  });

  describe('findAll', () => {
    it('should return a list of mapped users', async () => {
      userServiceMock.findAll.mockResolvedValue([makeUserEntity()]);
      const response = await userController.findAll();
      expect(userServiceMock.findAll).toHaveBeenCalledWith();
      expect(Array.isArray(response)).toBe(true);
      expect(response.every((item) => item instanceof UserResponseDto)).toBe(
        true,
      );
    });

    it('should return a empty array if no users found', async () => {
      userServiceMock.findAll.mockResolvedValue([]);
      const response = await userController.findAll();
      expect(userServiceMock.findAll).toHaveBeenCalledWith();
      expect(Array.isArray(response)).toBe(true);
      expect(response).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a mapped user', async () => {
      const dto = makeUuidDto();
      userServiceMock.findOne.mockResolvedValue(makeUserEntity());
      const response = await userController.findOne(dto);
      expect(userServiceMock.findOne).toHaveBeenCalledWith(dto.id);
      expect(response instanceof UserResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeUuidDto();
      userServiceMock.findOne.mockRejectedValue(new BadRequestException());
      await expect(userController.findOne(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userServiceMock.findOne).toHaveBeenCalledWith(dto.id);
    });
  });
});
