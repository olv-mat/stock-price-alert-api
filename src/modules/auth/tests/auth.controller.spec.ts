import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { makeCreateUserDto } from 'src/modules/user/tests/factories/create-user.dto.factory';
import { makeUserEntity } from 'src/modules/user/tests/factories/user.entity.factory';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { makeLoginDto } from './factories/login.dto.factory';

describe('AuthController', () => {
  let authController: AuthController;
  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authController = new AuthController(
      authServiceMock as unknown as AuthService,
    );
  });

  describe('login', () => {
    it('should correctly call the service and return an auth response', async () => {
      const dto = makeLoginDto();
      const userEntity = makeUserEntity();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      authServiceMock.login.mockResolvedValue({ userEntity, token });
      const response = await authController.login(dto);
      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(response instanceof AuthResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeLoginDto();
      authServiceMock.login.mockRejectedValue(new UnauthorizedException());
      await expect(authController.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('register', () => {
    it('should correctly call the service and return an auth response', async () => {
      const dto = makeCreateUserDto();
      const userEntity = makeUserEntity();
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      authServiceMock.register.mockResolvedValue({ userEntity, token });
      const response = await authController.register(dto);
      expect(authServiceMock.register).toHaveBeenCalledWith(dto);
      expect(response instanceof AuthResponseDto).toBe(true);
    });

    it('should propagate service exceptions', async () => {
      const dto = makeCreateUserDto();
      authServiceMock.register.mockRejectedValue(new ConflictException());
      await expect(authController.register(dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
